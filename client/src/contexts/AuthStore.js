import React, {createContext, useReducer} from 'react'
import {authReducer, authState} from '../reducers/auth'
import * as authActions from '../actions/auth'
import * as alertActions from '../actions/alert'
import {alertReducer, alertState} from '../reducers/alert'

export const AuthContext = createContext()

export default function AuthStore(props) {
    const [auth, authDispatch] = useReducer(authReducer, authState)
    const [alert, alertDispatch] = useReducer(alertReducer, alertState)

    const setAlert = (...e) => alertActions.setAlert(...e)(alertDispatch)
    const dispatchedActions = {
        setAlert,
        loadUser: (...e)=>authActions.loadUser(...e)(authDispatch),
        register: (...e)=>authActions.register(...e)(authDispatch, setAlert),
        login: (...e)=>authActions.login(...e)(authDispatch, setAlert),
        logout: (...e)=>authActions.logout(...e)(authDispatch)
    }
    
    const value = {auth, alert, ...dispatchedActions}

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
 }