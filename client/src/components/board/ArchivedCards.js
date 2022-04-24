import {useContext, useState, useEffect, useCallback, memo} from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';
//import Alert from '../../components/other/Alert';

import { Card, List, ListItem, CardContent, Button } from '@material-ui/core';

const ArchivedCards = memo (() => {
  const { board: {board: {listObjects, cardObjects}}, archiveCard, deleteCard } = useContext(BoardContext);

  const onSendBack = (card) => archiveCard(card, false)
  const onDelete = (listId, cardId) => deleteCard(listId, cardId)
  //Deleting cards on quick succession essentially forces an error from the server. I'll fix this on the backend branch

  return (
    <div>
      {/* <Alert/> */}
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
