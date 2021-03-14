import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useParams } from 'react-router-dom';
import { useCommitDailyCounts } from '../../api/commit';
import { DateTime } from 'luxon';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import MemberDropdown from '../MemberDropdown';
import { useDateFilterContext } from '../../contexts/DateFilterContext';
import CalendarFilter from '../CalendarFilter';
import DynamicBarChart from './BarChartComponent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2rem',
      display: 'flex',
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
      width: '70vw', //TODO: fix tab bar layout
    },
  }),
);

const getCodeData = (date: DateTime, commits: any[], merges: any[]) => {
  let commitCount = 0;
  let mergeCount = 0;
  for (const result of commits) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      commitCount += result.count;
    }
  }
  for (const result of merges) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      mergeCount += result.count;
    }
  }
  return {
    date: date.toLocaleString(DateTime.DATE_SHORT),
    commitCount,
    mergeCount,
  };
};

const getScoreData = (date: DateTime, scores: any[]) => {
  let score = 0;
  for (const result of scores) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      score += result.total_score;
    }
  }
  return {
    date: date.toLocaleString(DateTime.DATE_SHORT),
    score,
  };
};

const getCommentData = (date: DateTime, wordCounts: any[]) => {
  let wordCount = 0;
  for (const result of wordCounts) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      wordCount += result.count;
    }
  }
  return {
    date: date.toLocaleString(DateTime.DATE_SHORT),
    wordCount,
  };
};

const DynamicGraph: React.FC = () => {
  const classes = useStyles();
  const { startDate, endDate } = useDateFilterContext();
  const { id } = useParams<{ id: string }>();
  const [emails, setEmails] = useState<string[]>([]);
  const { data: commits } = useCommitDailyCounts(
    {
      repository: id,
      author_email: emails,
    },
    0,
    9000,
  );
  // const { data: merges } = useMergeDailyCounts(
  //   {
  //     repository: id,
  //   },
  //   0,
  //   9000,
  // );
  const [graphType, setGraphType] = useState(0);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      let date = DateTime.fromISO(startDate);
      const countsByDay = [];
      if (graphType == 0) {
        do {
          countsByDay.push(getCodeData(date, commits?.results || [], []));
          date = date.plus({ days: 1 });
        } while (date <= DateTime.fromISO(endDate));
      } else if (graphType == 1) {
        do {
          countsByDay.push(getScoreData(date, commits?.results || []));
          date = date.plus({ days: 1 });
        } while (date <= DateTime.fromISO(endDate));
      } else {
        do {
          countsByDay.push(getCommentData(date, []));
          date = date.plus({ days: 1 });
        } while (date <= DateTime.fromISO(endDate));
      }
      setGraphData(countsByDay);
    }
  }, [graphType, commits?.results, /* merges?.results, */ startDate, endDate]);

  const handleTabs = (event: React.ChangeEvent<unknown>, newType: number) => {
    setGraphType(newType);
  };

  return (
    <>
      <Grid container direction='column' spacing={2} className={classes.root}>
        <Grid item>
          <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
        </Grid>
        <Grid item>
          <CalendarFilter startDateIso={startDate} endDateIso={endDate} />
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
              value={graphType}
              onChange={handleTabs}
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
            <MemberDropdown
              repositoryId={id}
              onChange={(newEmails) => {
                setEmails(newEmails);
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <DynamicBarChart graphData={graphData} graphType={graphType} />
        </Grid>
      </Grid>
    </>
  );
};

export default DynamicGraph;
