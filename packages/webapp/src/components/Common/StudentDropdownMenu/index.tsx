import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { RepositoryMember } from '@ceres/types';

interface StudentProps {
  repoMembers: RepositoryMember[];
  studentName: string;
  setStudentName: React.Dispatch<React.SetStateAction<string>>;
}

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

const StudentDropdownMenu: React.FC<StudentProps> = (StudentProps) => {
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    StudentProps.setStudentName(event.target.value as string);
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
          value={StudentProps.studentName}
          onChange={handleChange}
          displayEmpty
          className={classes.selectLabel}
          autoWidth
        >
          <MenuItem value='All students'>All students</MenuItem>
          {StudentProps.repoMembers?.map((student) => (
            <MenuItem key={student.id} value={student.name}>
              {student.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default StudentDropdownMenu;
