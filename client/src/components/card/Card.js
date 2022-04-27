import { Fragment, useRef, useState, useEffect, useContext } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import getInitials from '../../utils/getInitials';

import CardMUI from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SubjectIcon from '@material-ui/icons/Subject';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { TextField, CardContent, Button, Avatar, Tooltip } from '@material-ui/core';
import CardModal from './CardModal';


const Card = ({ list, card, index }) => {
  const { board: {board: {cardObjects}}, editCard } = useContext(BoardContext)

  const [editing, setEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [title, setTitle] = useState('');
  const [height, setHeight] = useState(0);
  const [completeItems, setCompleteItems] = useState(0);
  const cardRef = useRef(null);

  const thisCard = cardObjects.find((object) => object._id === card._id);

  useEffect(() => {
    if (thisCard) {
      setTitle(thisCard.title);
      thisCard.checklist &&
        setCompleteItems(
          thisCard.checklist.reduce(
            (completed, item) => (completed += item.complete ? 1 : 0),
            0
          )
        );
    }
  }, [thisCard]);

  useEffect(() => {
    setHeight(cardRef?.current?.clientHeight);
  }, [thisCard, cardRef]);

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    setEditing(false);
    setMouseOver(false);
    editCard(card, { title })
  }

  return !thisCard || thisCard.archived ? null :
    <Fragment>
      <CardModal
        cardId={thisCard._id}
        open={openModal}
        setOpen={setOpenModal}
        card={thisCard}
        list={list}
        title = {title}
        setTitle= {setTitle}
      />
      {!editing ? (
        <Draggable draggableId={thisCard._id} index={index}>
          {(provided) => (
            <CardMUI
              className={`card ${mouseOver && !editing ? 'mouse-over' : ''}`}
              onMouseOver={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {mouseOver && !editing && (
                <Button
                  style={{
                    position: 'absolute',
                    bottom: height - 40,
                    left: '180px',
                    zIndex: 1,
                  }}
                  onClick={() => setEditing(true)}
                >
                  <EditIcon fontSize='small' />
                </Button>
              )}
              <CardContent
                onClick={() => {
                  setOpenModal(true);
                  setMouseOver(false);
                }}
                ref={cardRef}
              >
                {thisCard.label && thisCard.label !== 'none' && (
                  <div className='card-label' style={{ backgroundColor: thisCard.label }} />
                )}
                <p>{title}</p>
                <div className='card-bottom'>
                  <div className='card-bottom-left'>
                    {thisCard.description && (
                      <SubjectIcon className='description-indicator' fontSize='small' />
                    )}
                    {thisCard.checklist && thisCard.checklist.length > 0 && (
                      <div
                        className={`checklist-indicator ${
                          completeItems === thisCard.checklist.length
                            ? 'completed-checklist-indicator'
                            : ''
                        }`}
                      >
                        <AssignmentTurnedInIcon
                          fontSize='small'
                          className='checklist-indicator-icon'
                        />
                        {completeItems}/{thisCard.checklist.length}
                      </div>
                    )}
                  </div>
                  <div className='card-member-avatars'>
                    {thisCard.members.map((member) => {
                      return (
                        <Tooltip title={member.name} key={member.user}>
                          <Avatar className='avatar'>{getInitials(member.name)}</Avatar>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </CardMUI>
          )}
          
        </Draggable>
      ) : (
        <form className='create-card-form' onSubmit={onSubmitEdit}>
          <CardMUI>
            <CardContent className='card-edit-content'>
              <TextField
                margin='normal'
                fullWidth
                multiline
                required
                label="Edit this card's title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSubmitEdit(e)}
              />
            </CardContent>
          </CardMUI>
          <div className='card-actions'>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
            <Button
              onClick={() => {
                setEditing(false);
                setMouseOver(false);
              }}
            >
              <CloseIcon />
            </Button>
          </div>
        </form>
      )}
    </Fragment>

}

Card.propTypes = {
  cardId: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default Card;
