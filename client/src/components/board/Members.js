import React, { useState, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import getInitials from '../../utils/getInitials';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';

import { TextField, Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
//import Alert from '../../components/other/Alert';


const Members = () => {
  const { board: {board: {members}}, addMember } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const [inviting, setInviting] = useState(false);
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const [memberList, setMembers] = useState(members);

  const searchOptions = useMemo(() => {
    return users.filter((user) => members.find((boardMember) => boardMember.user === user._id))
  }, [users, members]);

  const handleInputValue = async (newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue && newInputValue !== '') {
      const search = (await axios.get(`/api/users/${newInputValue}`)).data.slice(0, 5);
      setUsers(search && search.length > 0 ? search : []);
    }
  };

  const onSubmit = useCallback(async () => {
    setMembers(memberList.concat(user));
    setInviting(false);
    setInputValue('');
    setUsers([]);
    try {
      await addMember(user._id);
      setAlert('Member added successfully', 'success');
    } catch(err){
      setMembers(members);
      setAlert('An error ocurred while inviting the user', 'error')
    }
  }, [user, memberList, members]);

  return (
    <div className='board-members-wrapper'>
      <div className='board-members'>
        {memberList.map((member) => {
          return (
            <Tooltip title={member.name} key={member.user}>
              <Avatar className='avatar'>{getInitials(member.name)}</Avatar>
            </Tooltip>
          );
        })}
      </div>
      {!inviting ? (
        <Button className='invite' variant='contained' onClick={() => setInviting(true)}>
          Invite
        </Button>
        // <Alert/>
      ) : (
        <div className='invite'>
          <Autocomplete
            value={user}
            onChange={(e, newMember) => setUser(newMember)}
            inputValue={inputValue}
            onInputChange={(e, newInputValue) => handleInputValue(newInputValue)}
            options={searchOptions}
            getOptionLabel={(member) => member.email}
            className='search-member'
            renderInput={(params) => (
              <TextField {...params} helperText='Search for user by email' autoFocus />
            )}
          />
          <div className='add-member'>
            <Button
              disabled={!user}
              variant='contained'
              color='primary'
              onClick={onSubmit}
            >
              Add Member
            </Button>
            <Button onClick={() => setInviting(false)}>
              <CloseIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
