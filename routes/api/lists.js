const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const member = require('../../middleware/member');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Board = require('../../models/Board');
const List = require('../../models/List');

// Add a list
router.post(
  '/',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const title = req.body.title;
      const boardId = req.header('boardId');

      // Create and save the list
      const newList = new List({ title });
      const list = await newList.save();

      // Assign the list to the board
      const board = await Board.findById(boardId).select('lists activity');
      board.lists.push(list.id);

      // Log activity
      const user = await User.findById(req.user.id);
      board.activity.unshift({ text: `${user.name} added '${title}' to this board` });
      await board.save();

      res.json(list);

    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Get all of a board's lists
router.get('/boardLists/:boardId', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate('lists').select('lists');
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    res.json(board.lists);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a list by id
router.get('/:id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ msg: 'List not found' })
    res.json(list);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Edit a list's title
router.patch(
  '/rename/:id',
  [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const list = await List.findById(req.params.id).select('title');
      if (!list) throw new Error({ message: 'List not found', status: 404 });

      res.json("List renamed successfully");
      list.title = req.body.title;
      await list.save();
      
    } catch (err) {
      res.status(err.status).send(err.message);
    }
  }
);

// Archive/Unarchive a list
router.patch('/archive/:archive/:id', [auth, member], async (req, res) => {
  try {
    const list = await List.findById(req.params.id).select('archived title');
    if (!list)  return res.status(404).json({ msg: 'List not found' });
    res.json(`List ${req.params.archive?'archived':'restored'} successfully`);

    list.archived = req.params.archive === 'true';
    await list.save();

    // Log activity
    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header('boardId'));
    board.activity.unshift({
      text: list.archived
        ? `${user.name} archived list '${list.title}'`
        : `${user.name} sent list '${list.title}' to the board`,
    });
    await board.save();

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Move a list
router.patch('/move/:id', [auth, member], async (req, res) => {
  try {
    const toIndex = req.body.toIndex ? req.body.toIndex : 0;
    const boardId = req.header('boardId');
    const board = await Board.findById(boardId);
    const listId = req.params.id;
    if (!listId) {
      return res.status(404).json({ msg: 'List not found' });
    }

    board.lists.splice(board.lists.indexOf(listId), 1);
    board.lists.splice(toIndex, 0, listId);
    res.send(board.lists);
    await board.save();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
