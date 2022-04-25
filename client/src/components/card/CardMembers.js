import {useContext, memo} from 'react';
import { BoardContext } from '../../contexts/BoardStore';

import PropTypes from 'prop-types';
import { Checkbox, FormGroup, FormControlLabel, FormControl } from '@material-ui/core';
import useStyles from '../../utils/modalStyles';
//import Alert from '../../components/other/Alert';


const CardMembers = memo(({ card }) => {
  const { board: {board: {members}}, addCardMember } = useContext(BoardContext);

  const classes = useStyles();

  const addMember = (action, member) => addCardMember(action, card, member)

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
                  checked={card.members.map(e=>e.user).indexOf(member.user) !== -1}
                  onChange={(e)=>addMember(e.target.checked, member)}
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
