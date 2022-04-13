import React from 'react';
import AlertMUI from '@material-ui/lab/Alert';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthStore';

export const Alert = (props) => {
  const {alert} = useContext(AuthContext)
  
  const alerts = alert

  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <AlertMUI severity={alert.alertType} key={alert.id}>
        {alert.msg}
      </AlertMUI>
    ))
  );
}

export default Alert;
