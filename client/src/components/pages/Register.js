// https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthStore';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Copyright from '../other/Copyright';
import useStyles from '../../utils/formStyles';

const Register = () => {
  const { auth: {isAuthenticated}, setAlert, register } = useContext(AuthContext);

  const classes = useStyles();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  useEffect(() => {
    document.title = 'TrelloClone | Sign Up';
  }, []);

  const onChange = useCallback((e) => setFormData({ ...formData, [e.target.name]: e.target.value }), [formData]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { name, email, password, password2 } = formData;
    if (password !== password2) setAlert('Passwords do not match', 'error');
    try{
      await register({ name, email, password });
    } catch (err) {
      setAlert(err.msg, 'error')
    }
  }, [formData]);

  if (isAuthenticated) return <Redirect to='/dashboard'/>

  return (
    <Container component='main' maxWidth='xs' className={classes.container}>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component='h1' variant='h4'>
          TrelloClone
        </Typography>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={12} key={key}>
                <TextField
                  variant='outlined'
                  autoCapitalize={key}
                  required
                  fullWidth
                  label={key==='password2' ? 'Confirm Password' : key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  autoFocus
                  onChange={onChange}
                  value={formData[key]}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Register;
