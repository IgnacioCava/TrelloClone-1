const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const member = require('../../middleware/member');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Board = require('../../models/Board');

// Add a board
router.post(
  '/',
  [auth, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, backgroundURL } = req.body;

      // Create and save the board
      const newBoard = new Board({ title, backgroundURL });
      const board = await newBoard.save();

      // Add board to user's boards
      const user = await User.findById(req.user.id);
      user.boards.unshift(board.id);
      await user.save();

      // Add user to board's members as admin
      board.members.push({ user: user.id, name: user.name });

      // Log activity
      board.activity.unshift({ text: `${user.name} created this board` });
      await board.save();

      res.json(board);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Get user's boards
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('boards', { _id: 1, title: 1 }).select('boards');
    if(!user) throw new Error({message: 'User not found', status: 404});
    res.json(user.boards);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
});

// Get a board by id
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Get a full board object by id
router.get('/opt/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate({
      path: 'lists',
      populate: {
        path: 'cards',
      }
    }).select("-activity");
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    res.json(board)
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a board's activity
router.get('/activity/:boardId', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).select('activity');
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    res.json(board.activity);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Change a board's title
router.patch('/rename/:id', [auth, member, [check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const board = await Board.findById(req.params.id).select('activity title');
      if (!board) throw new Error({message: 'Board not found', status: 404});
      
      // Log activity
      if (req.body.title !== board.title) {
        const user = await User.findById(req.user.id);
        if(!user) throw new Error({message: 'User not found', status: 404});
        board.activity.unshift({
          text: `${user.name} renamed this board (from '${board.title}')`,
        });
      }
      
      board.title = req.body.title;
      res.send("Board renamed successfully");
      await board.save();
      
    } catch (err) {
      res.status(err.status).send(err.message);
    }
  }
);

// Add a board member
router.put('/addMember/:userId', [auth, member], async (req, res) => {
  try {
    const board = await Board.findById(req.header('boardId')).select('members activity');
    const user = await User.findById(req.params.userId);
    if (!user) throw new Error({message: 'User not found', status: 404});

    // See if user is already a member of board. This method is 30% faster
    if(board.members.find(member => member.user === req.params.userId)){
      throw new Error({message: 'User already member of board', status: 400});
    }

    // Add board to user's boards
    user.boards.unshift(board.id);
    await user.save();

    // Add user to board's members with 'normal' role
    board.members.push({ user: user.id, name: user.name, role: 'normal' });

    // Log activity
    board.activity.unshift({ text: `${user.name} joined this board`,});
    await board.save();

    res.json(board.members);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
});

module.exports = router;
