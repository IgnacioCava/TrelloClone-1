import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { editCard, archiveCard } from '../../actions/board';
import { Modal, TextField, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoveCard from './MoveCard';
import DeleteCard from './DeleteCard';
import useStyles from '../../utils/modalStyles';

const CardModal = ({ cardId, open, setOpen, card }) => {
  const classes = useStyles();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(card.title);
  }, [card]);

  const onTitleDescriptionSubmit = async (e) => {
    e.preventDefault();
    dispatch(editCard(cardId, { title, description }));
    setOpen(false);
  };

  const onArchiveCard = async () => {
    dispatch(archiveCard(cardId, true));
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={`${classes.paper} ${classes.cardModal}`}>
        <form onSubmit={(e) => onTitleDescriptionSubmit(e)}>
          <div className={classes.modalTop}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              multiline
              id='title'
              label='Card title'
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={classes.cardTitle}
            />
            <Button onClick={() => setOpen(false)}>
              <CloseIcon />
            </Button>
          </div>
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            multiline
            id='description'
            label='Card description'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}
          >
            Save All Changes
          </Button>
        </form>
        <div className={classes.modalBottom}>
          <MoveCard cardId={cardId} setOpen={setOpen} />
          <div className={classes.modalBottomRight}>
            <Button
              variant='contained'
              className={classes.archiveButton}
              onClick={onArchiveCard}
            >
              Archive Card
            </Button>
            <DeleteCard cardId={cardId} setOpen={setOpen} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

CardModal.propTypes = {
  cardId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired,
};

export default CardModal;
