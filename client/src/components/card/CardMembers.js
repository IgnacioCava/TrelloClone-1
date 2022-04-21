import {useContext, useState, useCallback, useMemo, memo} from 'react';
import { BoardContext } from '../../contexts/BoardStore';
import { AuthContext } from '../../contexts/AuthStore';

import PropTypes from 'prop-types';
import { Checkbox, FormGroup, FormControlLabel, FormControl } from '@material-ui/core';
import useStyles from '../../utils/modalStyles';
//import Alert from '../../components/other/Alert';


const CardMembers = memo(({ card }) => {
  const { board: {board: {members}}, addCardMember } = useContext(BoardContext);
  const { setAlert } = useContext(AuthContext);

  const [cardMembers, setMembers] = useState(card.members.map((member) => member.user));

  const classes = useStyles();

  const visualMemberHandler = useCallback((member) => {
    let foundMember = cardMembers.find((memberId) => memberId === member)
    setMembers(foundMember ? cardMembers.filter((memberId) => memberId !== member) : cardMembers.concat(member))
  }, [cardMembers])

  const addMember = useCallback (async (e) => {
    e.persist()
    visualMemberHandler(e.target.name);
    try{
      await addCardMember({
        add: e.target.checked,
        cardId: card._id,
        userId: e.target.name,
      })
      setAlert(`Member ${e.target.checked?'added':'removed'} successfully`, 'success')
    } catch(err){
      setMembers(members)
      setAlert('An error ocurred while adding the user', 'error')
    }
  }, [members, card._id, visualMemberHandler])

  return (
    <div>
      <h3 className={classes.membersTitle}>Members</h3>
      <FormControl component='fieldset'>
        {/* <Alert/> */}
        <FormGroup>
          {members.map((member) => (
            <FormControlLabel
              key={member.user}
              control={
                <Checkbox
                  checked={cardMembers.indexOf(member.user) !== -1}
                  onChange={addMember}
                  name={member.user}
                />
              }
              label={member.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
})

CardMembers.propTypes = {
  card: PropTypes.object.isRequired,
};

export default CardMembers;
