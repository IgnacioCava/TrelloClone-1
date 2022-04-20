import React, { useState, useContext } from 'react';
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

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const archive = async () => {
    visualArchive(true)
    handleClose()
    try{
      await archiveList(listId, true)
      setAlert('List archived successfully', 'success')
    } catch(err){
      visualArchive(false)
      setAlert('An error ocurred while archiving the list', 'error')
    }
  }

  return (
    <div>
      <Button onClick={handleClick}>
        <MoreHorizIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <MoreHorizIcon />
        </MenuItem>
        <MenuItem onClick={archive}>
          Archive This List
        </MenuItem>
        <MenuItem>
          <MoveList listId={listId} closeMenu={handleClose} />
        </MenuItem>
      </Menu>
    </div>
  );
};

ListMenu.propTypes = {
  listId: PropTypes.string.isRequired,
};

export default ListMenu;
