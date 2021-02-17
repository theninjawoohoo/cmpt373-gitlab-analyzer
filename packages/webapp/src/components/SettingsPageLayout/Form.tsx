import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { usePostToken, useVerifyToken } from '../../api/token';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
      width: '25ch',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    '& > *': {
      margin: theme.spacing(1),
    },
    borderRadius: '30px',
  },
}));

const Form: React.FC = () => {
  const classes = useStyles();
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('Submit');
  const { mutate } = usePostToken();
  const { invalidate: invalidateToken } = useVerifyToken();

  const changeApiKey = (event: any) => {
    setApiKey(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    mutate(
      { token: apiKey },
      {
        onSuccess: () => {
          void invalidateToken();
          setMessage('Success!');
        },
      },
    );
  };

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <TextField
        value={apiKey}
        onChange={changeApiKey}
        id='standard-basic'
        label='Enter API Key'
      />
      <Button
        type='submit'
        className={classes.button}
        variant='contained'
        color='primary'
        disabled={message === 'Success!'}
      >
        {message}
      </Button>
    </form>
  );
};

export default Form;
