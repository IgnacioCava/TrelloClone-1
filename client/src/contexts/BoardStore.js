import React, {createContext, useReducer, useMemo} from "react";
import boardReducer, {board} from "../reducers/board";

export const BoardContext = createContext();

export default function BoardStore(props){
    const [state, boardDispatch] = useReducer(boardReducer, {board});

    const store = useMemo(()=>{
		return { ...state, boardDispatch:e=>e(boardDispatch) }
	}, [state, boardDispatch])
    return (
        <BoardContext.Provider value={{...store}}>
            {props.children}
        </BoardContext.Provider>
    )
}