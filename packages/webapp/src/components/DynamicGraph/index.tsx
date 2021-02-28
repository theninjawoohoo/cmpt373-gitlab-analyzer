import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StudentDropdownMenu from '../Common/StudentDropdownMenu';
import { useParams } from 'react-router-dom';
import { useRepositoryMembers } from '../../api/repo_members';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useCommitDailyCounts } from '../../api/commit';
import { DateTime } from 'luxon';
import { SearchResults } from '../../api/base';
import { Commit } from '@ceres/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2rem',
      display: 'flex',
      height: '100vh',
      width: '100vw',
      alignContent: 'flex-start',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
    tabs: {
      padding: '2rem',
      width: '65vw', //TODO: fix tab bar layout
    },
  }),
);

const DynamicGraph: React.FC = () => {
  const classes = useStyles();
  const [studentName, setStudentName] = useState('All students');
  const [startDate] = useState(DateTime.fromISO('2020-03-01'));
  const [endDate] = useState(DateTime.fromISO('2020-04-01'));
  const [value, setValue] = React.useState(0);
  const { id } = useParams<{ id: string }>();
  const { data: repoMembers } = useRepositoryMembers(id);
  const { data: commits } = useCommitDailyCounts(
    {
      repository: id,
    },
    0,
    9000,
  );
  const [graphData, setGraphData] = useState([]);

  // useEffect(() => {
  //   if (studentName != 'All students') {
  //     setGraphData(
  //       commits?.results.filter((commit) => commit.author_name == studentName),
  //     );
  //   } else {
  //     setGraphData(commits?.results);
  //   }
  // }, [repoMembers, commits, studentName]);

  const createGraphData = (
    date: DateTime,
    commits: SearchResults<Commit.DailyCount>,
  ) => {
    let count = 0;
    commits?.results.forEach((commit) => {
      if (DateTime.fromISO(commit.date).hasSame(date, 'day')) {
        count += commit.count;
      }
    });
    return {
      date: date.toLocaleString(DateTime.DATE_SHORT),
      count,
    };
  };

  useEffect(() => {
    if (commits && startDate && endDate) {
      let date = startDate;
      const countsByDay = [];
      do {
        countsByDay.push(createGraphData(date, commits));
        date = date.plus({ days: 1 });
      } while (date <= endDate);
      setGraphData(countsByDay);
    }
  }, [commits, startDate, endDate]);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number,
  ) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container direction='column' spacing={2} className={classes.root}>
        <Grid item>
          <Typography className={classes.title}>Contribution Graph</Typography>
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='space-between'
          className={classes.tabs}
        >
          <Grid item>
            <Tabs
              value={value}
              onChange={handleChange}
              variant='fullWidth'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab label='Codes' />
              <Tab label='Scores' />
              <Tab label='Comments' />
            </Tabs>
          </Grid>
          <Grid item>
            <StudentDropdownMenu
              repoMembers={repoMembers}
              studentName={studentName}
              setStudentName={setStudentName}
            />
          </Grid>
        </Grid>
        <Grid item>
          <BarChart width={1000} height={500} data={graphData}>
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend layout='vertical' align='right' verticalAlign='top' />
            <Bar dataKey='count' name='Commits' stackId='a' fill='#0A4D63' />
            {/* <Bar dataKey='mrs' name='Merge Requests' stackId='a' fill='#e37500' /> */}
          </BarChart>
        </Grid>
      </Grid>
    </>
  );
};

export default DynamicGraph;
