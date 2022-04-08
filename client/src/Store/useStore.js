import {useReducer, useMemo, createContext} from 'react';
import {reducers, states} from '../reducers';
import combineReducers from '../utils/combineReducers';

export const Context = createContext()

export default function useStore(reducer) {
	let requestedReducers = {}
	let requestedStates = {}

	reducer.forEach(e=>reducers.hasOwnProperty(e+'Reducer') ? requestedReducers[e] = reducers[e+'Reducer'] : null)

	reducer.forEach(e=>states.hasOwnProperty(e) ? requestedStates[e] = states[e] : null)

	const [state, dispatch] = useReducer(combineReducers(requestedReducers), requestedStates)

	const store = useMemo(()=>({
		state, dispatch,
	}), [state, dispatch])


	return {store, Context}

}