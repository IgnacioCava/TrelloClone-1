import React, { useState, useContext } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../../utils/modalStyles';
import { AuthContext } from '../../contexts/AuthStore';
//import Alert from '../../components/other/Alert';


const CreateChecklistItem = ({ cardId, updateList, list }) => {
  const { addChecklistItem } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const classes = useStyles();
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setText('');
    const prevList = {...list}
    updateList(list.concat({ text, complete: false }))
    try{
      await addChecklistItem(cardId, { text })
      setAlert('Checklist item added successfully', 'success')
    } catch(err){
      updateList(prevList)
      setAlert('An error ocurred while adding the checklist item', 'error')
    }
  };

  return !adding ? (
    <div className={classes.checklistBottom}>
      <Button variant='contained' onClick={() => setAdding(true)}>
        + Add an item
      </Button>
      {/* <Alert/> */}
    </div>
  ) : (
    <div className={classes.checklistBottom}>
      <form onSubmit={onSubmit}>
        <TextField
          variant='filled'
          fullWidth
          multiline
          required
          label='Add an item'
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
        />
        <div>
          <Button type='submit' variant='contained' color='primary'>
            Add
          </Button>
          <Button
            onClick={() => {
              setAdding(false);
              setText('');
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      </form>
    </div>
  );
};

CreateChecklistItem.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CreateChecklistItem;
