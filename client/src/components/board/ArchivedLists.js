import { useContext } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//import Alert from '../../components/other/Alert';


const ArchivedLists = ({update}) => {
  const { board: {board: {listObjects}}, archiveList } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);


  const unarchive = async (list) => {
    visualUnarchive(list, true)
    try{
      await archiveList(list._id, false)
      setAlert('List restored successfully', 'success')
    } catch(err){
      visualUnarchive(list, false)
      setAlert('An error ocurred while restoring the list', 'error')
    }
  }
  
  const visualUnarchive = (list, state) => {
    list.archived = !state
    update()
  }

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
};

export default ArchivedLists;
