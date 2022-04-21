import { useContext, memo, useCallback } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//import Alert from '../../components/other/Alert';


const ArchivedLists = memo(({update}) => {
  const { board: {board: {listObjects}}, archiveList } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const visualUnarchive = (list, state) => {
    list.archived = !state
    update()
  }

  const unarchive = useCallback(async (list) => {
    visualUnarchive(list, true)
    try{
      await archiveList(list._id, false)
      setAlert('List restored successfully', 'success')
    } catch(err){
      visualUnarchive(list, false)
      setAlert('An error ocurred while restoring the list', 'error')
    }
  }, [visualUnarchive])
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
