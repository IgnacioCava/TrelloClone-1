import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoveList from './MoveList';
import { BoardContext } from '../../contexts/BoardStore';


const ListMenu = ({ list }) => {
  const { archiveList } = useContext(BoardContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const archive = async () => {
    setAnchorEl(null)
    archiveList(list, true)
  }
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
          <MoveList listId={list._id} closeMenu={() => setAnchorEl(null)} />
        </MenuItem>
      </Menu>
    </div>
  );
}

ListMenu.propTypes = {
  listId: PropTypes.string.isRequired,
};

export default ListMenu;
