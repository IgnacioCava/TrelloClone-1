import { useState, useContext, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoveList from './MoveList';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';


const ListMenu = ({ listId, visualArchive }) => {
  const { archiveList } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const archive = async () => {
    visualArchive(true)
    setAnchorEl(null)
    try{
      await archiveList(listId, true)
      setAlert('List archived successfully', 'success')
    } catch(err){
      visualArchive(false)
      setAlert('An error ocurred while archiving the list', 'error')
    }}

  return (
    <div>
      <Button onClick={e => setAnchorEl(e.currentTarget)}>
        <MoreHorizIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <MoreHorizIcon />
        </MenuItem>
        <MenuItem onClick={archive}>
          Archive This List
        </MenuItem>
        <MenuItem>
          <MoveList listId={listId} closeMenu={() => setAnchorEl(null)} />
        </MenuItem>
      </Menu>
    </div>
  );
}

ListMenu.propTypes = {
  listId: PropTypes.string.isRequired,
};

export default ListMenu;
