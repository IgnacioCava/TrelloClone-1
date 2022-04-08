import alertReducer, {alert} from './alert';
import authReducer, {auth} from './auth';
import boardReducer, {board} from './board';

export const reducers = { alertReducer, authReducer, boardReducer }
export const states = { alert, auth, board }