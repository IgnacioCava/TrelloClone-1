import withStore from "./Store/withStore"
import { getBoards } from "./actions/board"
import { add, subtract } from "./actions/test"

export const Test = withStore(({store, props}) => {
    const {state, dispatch} = store
console.log(dispatch)
    return (
        <div>
            <h1>Test</h1>
            <p>Props: {JSON.stringify(props)}</p>
            <p>State: {JSON.stringify(state)}</p>
            <p>State: {state.count}</p>
            <button onClick={()=>dispatch(add())}>add</button>
            <button onClick={()=>dispatch(subtract())}>rest</button>
        </div>
    )
})