import React, { Fragment, useState, useContext } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../../utils/modalStyles';
import { AuthContext } from '../../contexts/AuthStore';
//import Alert from '../../components/other/Alert';


const ChecklistItem = ({ item, card, updateList, list }) => {
  const { completeChecklistItem, editChecklistItem, deleteChecklistItem } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const classes = useStyles();
  const [text, setText] = useState(item.text);
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(item.complete);

  const onEdit = async (e) => {
    e.preventDefault();
    setEditing(false);
    try{
      await editChecklistItem(card._id, item._id, { text })
      setAlert('Checklist item edited successfully', 'success')
    } catch(err){
      setAlert('An error ocurred while editing the checklist item', 'error')
    }
  };

  const onComplete = async (e) => {
    visualCheck()
    try{
      await completeChecklistItem({
        cardId: card._id,
        complete: e.target.checked,
        itemId: item._id,
      })
      setAlert('Checklist item completed successfully', 'success')
    } catch(err){
      visualCheck()
      setAlert('An error ocurred while completing the checklist item', 'error')
    }
  };

  const visualCheck = (e) => {
    setChecked(!checked);
  };

  const onDelete = async (e) => {
    const prevList = {...list}
    visualDelete()
    try{
      await deleteChecklistItem(card._id, item._id)
      setAlert('Checklist item deleted successfully', 'success')
    } catch(err){
      undoDelete(prevList)
      setAlert('An error ocurred while deleting the checklist item', 'error')
    }
    
  };

  const visualDelete = () => updateList(list.filter(e=>e._id!==item._id));
  const undoDelete = (lastList) => updateList(lastList);

  return (
    <div className={classes.checklistItem}>
      {editing ? (
        <form onSubmit={onEdit} className={classes.checklistFormLabel}>
          <TextField
            variant='filled'
            fullWidth
            multiline
            required
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onEdit(e)}
          />
          <div>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
            <Button
              onClick={() => {
                setEditing(false);
                setText(item.text);
              }}
            >
              <CloseIcon />
            </Button>
          </div>
        </form>
      ) : (
        <Fragment>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={onComplete}
                name={item._id}
              />
            }
            label={text}
            className={classes.checklistFormLabel}
          />
          {/* <Alert/> */}
          <div className={classes.itemButtons}>
            <Button className={classes.itemButton} onClick={() => setEditing(true)}>
              <EditIcon />
            </Button>
            <Button color='secondary' className={classes.itemButton} onClick={onDelete}>
              <HighlightOffIcon />
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

ChecklistItem.propTypes = {
  item: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
};

export default ChecklistItem;
