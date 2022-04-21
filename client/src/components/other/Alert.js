import React, {useContext} from 'react';
import AlertMUI from '@material-ui/lab/Alert';
import { AuthContext } from '../../contexts/AuthStore';

// The way alerts are currently stored and handled hinders their usability, as I currently cannot place multiple Alert components across the app. Will change how this works later.
const Alert = () => {
  const { alert } = useContext(AuthContext);

  let lastAlert = alert&&alert[alert.length-1]
  return (
    alert !== null &&
    alert.length > 0 &&

    <AlertMUI severity={lastAlert.alertType} key={lastAlert.id}>
      {lastAlert.msg}
    </AlertMUI>
    
  );
};

export default Alert;
