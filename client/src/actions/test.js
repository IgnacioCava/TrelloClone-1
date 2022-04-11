import {ADD, SUBTRACT} from './types';

export const add = () => dispatch =>{
    dispatch({type: ADD});
}

export const subtract = () => dispatch =>{
    dispatch({type: SUBTRACT});
}
