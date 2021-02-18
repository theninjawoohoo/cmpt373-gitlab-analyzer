import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      margin: theme.spacing(2),
      minWidth: 120,
    },
    selectLabel: {
      marginTop: theme.spacing(1),
    },
  }),
);

const students = [
  { studentId: 'scherbatsky', studentName: 'Robin Scherbatsky' },
  { studentId: 'mosby', studentName: 'Ted Mosby' },
  { studentId: 'mcconnell', studentName: 'Tracy McConnell' },
  { studentId: 'eriksen', studentName: 'Marshall Eriksen' },
  { studentId: 'aldrin', studentName: 'Lily Aldrin' },
  { studentId: 'stinson', studentName: 'Barney Stinson' },
];

const StudentDropdownMenu = () => {
  const classes = useStyles();
  const [studentName, setStudentName] = React.useState('All students');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStudentName(event.target.value as string);
    alert(`${event.target.value} was selected.`); //TODO: Show results for the selected student accordingly
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
          <MenuItem value='All students'>All students</MenuItem>
          {students.map((student) => (
            <MenuItem key={student.studentId} value={student.studentName}>
              {student.studentName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default StudentDropdownMenu;
