import React, { Fragment, useState, useContext } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../../utils/modalStyles';



const ChecklistItem = ({ item, card }) => {
  const { completeChecklistItem, editChecklistItem, deleteChecklistItem } = useContext(BoardContext);

  const classes = useStyles();
  const [text, setText] = useState(item.text);
  const [editing, setEditing] = useState(false);

  const onEdit = (e) => {
    e.preventDefault();
    setEditing(false);
    editChecklistItem(card, item, { text })
  }

  const onComplete = (e) => completeChecklistItem(card, item, e.target.checked)
  const onDelete = () => deleteChecklistItem(card, item)

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
                checked={item.complete}
                onChange={onComplete}
                name={item._id}
              />
            }
            label={item.text}
            className={classes.checklistFormLabel}
          />
          
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
