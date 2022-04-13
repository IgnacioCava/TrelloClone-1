import React, {useMemo, useContext} from 'react';
import PropTypes from 'prop-types';
import { addCardMember } from '../../actions/board';
import { Checkbox, FormGroup, FormControlLabel, FormControl } from '@material-ui/core';
import useStyles from '../../utils/modalStyles';
import { BoardContext } from '../../contexts/BoardStore';

const CardMembers = (props) => {
  const { card } = props;
  const {board, boardDispatch} = useContext(BoardContext)


  const boardMembers = board?.board.members

  const members = useMemo(() => {
    return card.members.map((member) => member.user)
  }, [card.members])

  const classes = useStyles();

  return (
    <div>
      <h3 className={classes.membersTitle}>Members</h3>
      <FormControl component='fieldset'>
        <FormGroup>
          {boardMembers?.map((member) => (
            <FormControlLabel
              key={member.user}
              control={
                <Checkbox
                  checked={members.indexOf(member.user) !== -1}
                  onChange={async (e) =>
                    boardDispatch(
                      addCardMember({
                        add: e.target.checked,
                        cardId: card._id,
                        userId: e.target.name,
                      })
                    )
                  }
                  name={member.user}
                />
              }
              label={member.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  )
}

CardMembers.propTypes = {
  card: PropTypes.object.isRequired,
}

export default CardMembers
