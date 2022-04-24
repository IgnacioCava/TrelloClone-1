import { useState, useContext, memo } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { BoardContext } from '../../contexts/BoardStore';
//import Alert from '../../components/other/Alert';

const BoardTitle = memo(({ board }) => {
  const { renameBoard } = useContext(BoardContext);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  document.title = title + ' | TrelloClone';

  const onSubmit = async (e) => {
    e.preventDefault();
    setEditing(false);
    renameBoard(board, title);
  }

  return !editing ? (
    <h2 className='board-title' onClick={() => setEditing(true)}>
      {board.title}
    </h2>
    // <Alert />
  ) : (
    <form className='board-title-form' onSubmit={onSubmit}>
      <TextField
        variant='outlined'
        required
        value={title}
        size='small'
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
});

BoardTitle.propTypes = {
  board: PropTypes.object.isRequired,
};

export default BoardTitle;
