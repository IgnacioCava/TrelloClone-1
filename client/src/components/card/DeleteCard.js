import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';


const DeleteCard = ({ cardId, setOpen, list, setList }) => {
  const { deleteCard } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);

  const visualDelete = () => setList({...list, cards:list.cards.filter(card => card !== cardId)});
  const undoDelete = (lastList) => setList(lastList);

  const onDeleteCard = useCallback(async () => {
    const prevList = {...list}
    visualDelete()
    setOpenDialog(false)
    setOpen(false)
    try{
      await deleteCard(list._id, cardId);
      setAlert('Card deleted successfully', 'success')
    } catch(err) {
      undoDelete(prevList)
      setAlert('An error ocurred while deleting the card', 'error');
    }
  }, [cardId, list])

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
  list: PropTypes.object.isRequired,
};

export default DeleteCard;
