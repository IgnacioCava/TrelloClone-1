import {useContext, useState, useEffect, useCallback, memo} from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';
//import Alert from '../../components/other/Alert';

import { Card, List, ListItem, CardContent, Button } from '@material-ui/core';

const ArchivedCards = memo(({update}) => {
  const { board: {board: {listObjects, cardObjects}}, archiveCard, deleteCard } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const [archivedCards, setArchivedCards] = useState(cardObjects);

  const [lastDelete, setLastDelete] = useState(null);

  useEffect(() => {
    setArchivedCards(cardObjects)
  }, [cardObjects,listObjects])

  const visualDelete = cardId => {
    setArchivedCards(cardObjects.filter((object) => object._id !== cardId))
    setLastDelete(cardObjects.find((object) => object._id === cardId))
  }

  const undoDelete = () => {
    setArchivedCards(archivedCards.concat(lastDelete))
    setLastDelete(null)
    setAlert('An error ocurred while deleting the card', 'error')
  }

  const onDelete = useCallback(async (listId, cardId) => {
    visualDelete(cardId)
    try{
      await deleteCard(listId, cardId)
      setAlert('Card deleted successfully', 'success')
    } catch(err){
      undoDelete()
    }
  }, [visualDelete, undoDelete])
  //Deleting cards on quick succession essentially forces an error from the server. I'll fix this on the backend branch

  const visualUnarchive = (card, state) => {
    card.archived = !state
    update()
  }

  const onSendBack = useCallback(async (card) => {
    visualUnarchive(card, true)
    try{
      await archiveCard(card._id, false)
      setAlert('Card restored successfully', 'success')
    } catch(err){
      visualUnarchive(card, false)
      setAlert('An error ocurred while restoring the card', 'error')
    }
  }, [visualUnarchive])

  return (
    <div>
      {/* <Alert/> */}
      <List>
        {archivedCards
          .filter((card) => card.archived)
          .map((card, index) => (
            <ListItem key={index} className='archived-card'>
              <Card>
                <CardContent>{card.title}</CardContent>
              </Card>
              <div>
                <Button
                  color='secondary'
                  onClick={() => onDelete(listObjects.find((list) => list.cards.includes(card._id))._id, card._id)}>
                  Delete Card
                </Button>
                <Button onClick={() => onSendBack(card)}>
                  Send to List
                </Button>
              </div>
            </ListItem>
          ))}
      </List>
    </div>
  );
})

export default ArchivedCards;
