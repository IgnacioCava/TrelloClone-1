import {ADD, SUBTRACT, ADD2, SUBTRACT2} from './types';

export const add = () => dispatch => dispatch({type: ADD});

export const subtract = () => dispatch => dispatch({type: SUBTRACT});

export const add2 = () => dispatch => dispatch({type: ADD2});

export const subtract2 = () => dispatch => dispatch({type: SUBTRACT2});
