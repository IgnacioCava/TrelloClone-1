import React, {useContext} from 'react';
import AlertMUI from '@material-ui/lab/Alert';
import { AuthContext } from '../../contexts/AuthStore';
import { BoardContext } from '../../contexts/BoardStore';

const Alert = () => {
  const { alert } = useContext(AuthContext);
  const context = useContext(BoardContext);
  const boardAlert = context?.boardAlert||[];
  
  let alerts = [...alert, ...boardAlert];
  let lastAlert = alerts&&alerts[alerts.length-1]
  return (
    alerts !== null &&
    alerts.length > 0 &&

    <AlertMUI severity={lastAlert.alertType} key={lastAlert.id}>
      {lastAlert.msg}
    </AlertMUI>
    
  );
};

export default Alert;
