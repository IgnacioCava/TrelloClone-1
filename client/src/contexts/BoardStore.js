import React, { createContext, useReducer } from 'react'
import * as alertActions from '../actions/alert'
import * as boardActions from '../actions/board'
import { alertReducer, alertState } from '../reducers/alert'
import { boardReducer, boardState } from '../reducers/board'

export const BoardContext = createContext()

export default function BoardStore(props) {
    const [board, boardDispatch] = useReducer(boardReducer, boardState)
    const [boardAlert, alertDispatch] = useReducer(alertReducer, alertState)

    const setAlert = (...e) => alertActions.setAlert(...e)(alertDispatch)
    const dispatchedActions = {
        setAlert,
        getBoards: (...e) => boardActions.getBoards(...e)(boardDispatch),
        getBoard: (...e) => boardActions.getBoard(...e)(boardDispatch),
        addBoard: (...e) => boardActions.addBoard(...e)(boardDispatch),
        renameBoard: (...e) => boardActions.renameBoard(...e)(boardDispatch, setAlert),
        getList: (...e) => boardActions.getList(...e)(boardDispatch),
        addList: (...e) => boardActions.addList(...e)(boardDispatch),
        renameList: (...e) => boardActions.renameList(...e)(boardDispatch, setAlert),
        archiveList: (...e) => boardActions.archiveList(...e)(boardDispatch, setAlert),
        addCard: (...e) => boardActions.addCard(...e)(boardDispatch),
        getCard: (...e) => boardActions.getCard(...e)(boardDispatch),
        editCard: (...e) => boardActions.editCard(...e)(boardDispatch, setAlert),
        moveCard: (...e) => boardActions.moveCard(...e)(boardDispatch, setAlert),
        archiveCard: (...e) => boardActions.archiveCard(...e)(boardDispatch, setAlert),
        deleteCard: (...e) => boardActions.deleteCard(...e)(boardDispatch, setAlert),
        getActivity: (...e) => boardActions.getActivity(...e)(boardDispatch),
        addMember: (...e) => boardActions.addMember(...e)(boardDispatch, setAlert),
        moveList: (...e) => boardActions.moveList(...e)(boardDispatch, setAlert),
        getUsers: (...e) => boardActions.getUsers(...e),
        addCardMember: (...e) => boardActions.addCardMember(...e)(boardDispatch, setAlert, setAlert),
        addChecklistItem: (...e) => boardActions.addChecklistItem(...e)(boardDispatch, setAlert),
        editChecklistItem: (...e) => boardActions.editChecklistItem(...e)(boardDispatch, setAlert),
        completeChecklistItem: (...e) => boardActions.completeChecklistItem(...e)(boardDispatch, setAlert),
        deleteChecklistItem: (...e) => boardActions.deleteChecklistItem(...e)(boardDispatch, setAlert)
    }
 
    const value = {board, boardAlert, ...dispatchedActions}
    
    return (
        <BoardContext.Provider value={value}>
            {props.children}
        </BoardContext.Provider>
    )
 }