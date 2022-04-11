import alertReducer, {alert} from './alert';
import authReducer, {auth} from './auth';
import boardReducer, {board} from './board';
import testReducer, {test} from './test';
import test2Reducer, {test2} from './test2';

export const reducers = { alertReducer, authReducer, boardReducer, testReducer, test2Reducer }
export const states = { alert, auth, board, test, test2 }