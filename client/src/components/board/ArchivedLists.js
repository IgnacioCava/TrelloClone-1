import { useContext, memo } from 'react';
import { BoardContext } from '../../contexts/BoardStore';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//import Alert from '../../components/other/Alert';


const ArchivedLists = memo(() => {
  const { board: {board: {listObjects}}, archiveList } = useContext(BoardContext);

  const unarchive = (list) => archiveList(list, false)
  //Restoring lists on quick succession essentially forces an error from the server. I'll fix this on the backend branch
  
  return (
    <div>
      <List>
        {listObjects
          .filter((list) => list.archived)
          .map((list, index) => (
            <ListItem key={index}>
              <ListItemText primary={list.title} />
              <Button onClick={() => unarchive(list)}>
                Send to Board
              </Button>
            </ListItem>
          ))}
      </List>
    </div>
  );
})

export default ArchivedLists;
