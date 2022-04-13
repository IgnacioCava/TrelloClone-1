import React, {createContext, useReducer, useMemo} from "react";
import authReducer, {auth} from "../reducers/auth";
import alertReducer, {alert} from "../reducers/alert";
import combineReducers from "../utils/combineReducers";

export const AuthContext = createContext();

export default function AuthStore(props){
    const [state, dispatch] = useReducer(combineReducers({auth: authReducer, alert: alertReducer}), {auth, alert});

    const store = useMemo(()=>{
		return { ...state, dispatch:e=>e(dispatch) }
	}, [state, dispatch])
    
    return (
        <AuthContext.Provider value={{...store}}>
            {props.children}
        </AuthContext.Provider>
    )
}