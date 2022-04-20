import React, {useContext} from 'react';
import AlertMUI from '@material-ui/lab/Alert';
import { AuthContext } from '../../contexts/AuthStore';

// The way alerts are currently stored and handled hinders their usability, as I currently cannot place multiple Alert components across the app. Will change how this works later.
const Alert = () => {
  const { alert } = useContext(AuthContext);

  return (
    alert !== null &&
    alert.length > 0 &&

    <AlertMUI severity={alert[0].alertType} key={alert[0].id}>
      {alert[0].msg}
    </AlertMUI>
    
  );
};

export default Alert;
