import React, { useState, useContext, useCallback } from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { AuthContext } from '../../contexts/AuthStore';
//import Alert from '../../components/other/Alert';


const ListTitle = ({ list }) => {
  const { renameList } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  
  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    setEditing(false);
    try{
      await renameList(list._id, { title })
      setAlert('List renamed successfully', 'success')
    } catch(err){
      setTitle(list.title);
      setAlert('An error ocurred while renaming the list', 'error')
    }
  }, [list._id, title])

  return !editing ? (
    <>
      <h3 className='list-title' onClick={() => setEditing(true)}>
        {title}
      </h3>
      {/* <Alert/> */}
    </>
  ) : (
    <form onSubmit={onSubmit}>
      <TextField required value={title} onChange={(e) => setTitle(e.target.value)}/>
    </form>
  );
};

ListTitle.propTypes = {
  list: PropTypes.object.isRequired,
};

export default ListTitle;
