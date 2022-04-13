import React, { useContext } from 'react';
import { archiveList } from '../../actions/board';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { BoardContext } from '../../contexts/BoardStore';

const ArchivedLists = () => {
  const {board, boardDispatch} = useContext(BoardContext)

  const listObjects = board?.board.listObjects

  const onSubmit = async (listId) => boardDispatch(archiveList(listId, false))

  return (
    <div>
      <List>
        {listObjects?.filter((list) => list.archived)
          .map((list, index) => (
            <ListItem key={index}>
              <ListItemText primary={list.title} />
              <Button onClick={() => onSubmit(list._id)}>Send to Board</Button>
            </ListItem>
          ))}
      </List>
    </div>
  )
}

export default ArchivedLists;
