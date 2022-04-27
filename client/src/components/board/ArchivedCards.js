import {useContext, memo} from 'react';
import { BoardContext } from '../../contexts/BoardStore';


import { Card, List, ListItem, CardContent, Button } from '@material-ui/core';

const ArchivedCards = memo (() => {
  const { board: {board: {listObjects, cardObjects}}, archiveCard, deleteCard } = useContext(BoardContext);

  const onSendBack = (card) => archiveCard(card, false)
  const onDelete = (listId, card) => deleteCard(listId, card)

  return (
    <div>
      
      <List>
        {cardObjects
          .filter((card) => card.archived)
          .map((card, index) => (
            <ListItem key={index} className='archived-card'>
              <Card>
                <CardContent>{card.title}</CardContent>
              </Card>
              <div>
                <Button
                  color='secondary'
                  onClick={() => {
                    onDelete(listObjects.find((list) => list.cards.map(e=>e._id).includes(card._id))._id, card)}
                    }>
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
