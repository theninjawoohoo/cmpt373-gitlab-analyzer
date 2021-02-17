import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectLabel: {
      marginTop: theme.spacing(1),
    },
  }),
);

const StudentDropdownMenu = () => {
  const classes = useStyles();
  const [studentName, setStudentName] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStudentName(event.target.value as string);
  };

  return (
    <div>
      <FormControl variant='outlined' className={classes.menu}>
        <InputLabel shrink id='student-dropdown-menu-input-label'>
          Show results for:
        </InputLabel>
        <Select
          labelId='student-dropdown-menu-input-label'
          id='student-dropdown-menu-options'
          value={studentName}
          onChange={handleChange}
          displayEmpty
          className={classes.selectLabel}
          autoWidth
        >
          <MenuItem value=''>All students</MenuItem>
          <MenuItem value={40}>First Student</MenuItem>
          <MenuItem value={10}>Second Student</MenuItem>
          <MenuItem value={20}>Third Student</MenuItem>
          <MenuItem value={30}>Fourth Student</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default StudentDropdownMenu;
