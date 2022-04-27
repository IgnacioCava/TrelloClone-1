import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { BoardContext } from '../../contexts/BoardStore';


const DeleteCard = ({ card, listId, setOpen }) => {
  const { deleteCard } = useContext(BoardContext);

  const [openDialog, setOpenDialog] = useState(false);

  const onDeleteCard = () => {
    deleteCard(listId, card);
    setOpenDialog(false)
    setOpen(false)
  }

  return (
    <div>
      <Button variant='contained' color='secondary' onClick={()=>setOpenDialog(true)}>
        Delete Card
      </Button>
      <Dialog open={openDialog} onClose={()=>setOpenDialog(false)}>
        <DialogTitle>{'Delete card?'}</DialogTitle>
        <DialogActions>
          <Button onClick={onDeleteCard} variant='contained' color='secondary' autoFocus>
            Delete
          </Button>
          <Button onClick={()=>setOpenDialog(false)}>
            <CloseIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DeleteCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  listId: PropTypes.string.isRequired,
};

export default DeleteCard;
