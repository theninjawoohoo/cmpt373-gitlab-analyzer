import React, { useState, Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface FormProps {
  apiKey?: string;
  setApiKey: Dispatch<SetStateAction<string>>;
  handleClose: () => void;
}
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

const Form: React.FC<FormProps> = (FormProps) => {
  const classes = useStyles();
  const [apiKey, setApiKey] = useState('');
  const changeApiKey = (event: any) => {
    setApiKey(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    FormProps.handleClose();
    const data = apiKey;
    fetch('/api/api-key', {
      method: 'POST',
      body: data,
    });
    FormProps.setApiKey(apiKey);
  };

  return (
    <form
      className={classes.root}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <h3>Please Enter your GitLab API Key</h3>
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
      >
        Submit
      </Button>
    </form>
  );
};

export default Form;
