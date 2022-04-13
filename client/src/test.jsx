
import { getBoards } from "./actions/board"
import { add, subtract, add2, subtract2 } from "./actions/test"
import { useContext, useEffect } from "react"
import { Context } from "./Store/useStore"
import { AuthContext } from "./contexts/AuthStore"

export const Test = (props) => {
    //const {state, dispatch} = store
    const { state, dispatch } = useContext(AuthContext)

    return (
        <div>
            <h1>Test</h1>
            <p>Props: {JSON.stringify(props)}</p>
            <hr/>
            <p>State: {JSON.stringify(state)}</p>
            <button onClick={()=>dispatch(add())}>add</button>
            <button onClick={()=>dispatch(subtract())}>rest</button>
            <hr/>
            <button onClick={()=>dispatch(add2())}>add2</button>
            <button onClick={()=>dispatch(subtract2())}>rest2</button>
        </div>
    )
}