import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';

import { GithubPicker } from 'react-color';
import { Modal, TextField, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoveCard from './MoveCard';
import DeleteCard from './DeleteCard';
import CardMembers from './CardMembers';
import Checklist from '../checklist/Checklist';
import useStyles from '../../utils/modalStyles';
//import Alert from '../../components/other/Alert';

const CardModal = ({ cardId, open, setOpen, card, list, setList, visualArchive, update, title, setTitle }) => {
  const { editCard, archiveCard } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const classes = useStyles();
  const [description, setDescription] = useState(card.description);

  const onTitleDescriptionSubmit = async (e) => {
    e.preventDefault();
    try{
      await editCard(cardId, {title, description});
      setAlert('Card edited successfully', 'success')
    } catch(err) {
      setTitle(card.title);
      setAlert('An error ocurred while editing the card', 'error');
    }
    update()
  };

  const onArchiveCard = async () => {
    setOpen(false);
    visualArchive(true)
    try{
      await archiveCard(cardId, true)
      setAlert('Card archived successfully', 'success')
    } catch(err) {
      visualArchive(false)
      setAlert('An error ocurred while archiving the card', 'error');
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={`${classes.paper} ${classes.cardModal}`}>
        <form onSubmit={onTitleDescriptionSubmit}>
          <div className={classes.modalTop}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              multiline
              label='Card title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onTitleDescriptionSubmit(e)}
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
            label='Card description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={
                title === card.title &&
                (description === card.description ||
                  (description === '' && !card.description))
              }
              className={classes.button}
            >
              Save All Changes
            </Button>
            {/* <Alert/> */}
          </>
        </form>
        <div className={classes.modalSection}>
          <CardMembers card={card} />
          <div>
            <h3 className={classes.labelTitle}>Label</h3>
            <GithubPicker
              className={classes.colorPicker}
              onChange={async (color) => editCard(cardId, { label: color.hex })}
            />
            <Button
              className={classes.noLabel}
              variant='outlined'
              onClick={async () => editCard(cardId, { label: 'none' })}
            >
              No Label
            </Button>
          </div>
        </div>
        <Checklist card={card} />
        <div className={classes.modalSection}>
          <MoveCard cardId={cardId} setOpen={setOpen} thisList={list} setList={setList} update={update}/>
          <div className={classes.modalBottomRight}>
            <Button
              variant='contained'
              className={classes.archiveButton}
              onClick={onArchiveCard}
            >
              Archive Card
            </Button>
            <DeleteCard cardId={cardId} setOpen={setOpen} list={list} setList={setList}/>
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
  list: PropTypes.object.isRequired,
};

export default CardModal;
