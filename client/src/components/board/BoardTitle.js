import { useState, useContext, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';
//import Alert from '../../components/other/Alert';

const BoardTitle = memo(({ board }) => {
  const { renameBoard } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  document.title = title + ' | TrelloClone';

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setEditing(false);
    try{
      await renameBoard(board._id, { title });
      setAlert('Board renamed successfully', 'success');
    } catch(err){
      setTitle(board.title);
      setAlert('An error ocurred while updating the board title', 'error');
    }
  }, [board, title]);

  return !editing ? (
    <h2 className='board-title' onClick={() => setEditing(true)}>
      {title}
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
