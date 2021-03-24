import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useGetCommits } from '../../api/commit';
import { DateTime } from 'luxon';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import MemberDropdown from '../MemberDropdown';
import { useFilterContext } from '../../contexts/FilterContext';
import CalendarFilter from '../CalendarFilter';
import DynamicBarChart from './BarChartComponent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

const getCodeData = (date: DateTime, commits: any[], merges: any[]) => {
  let commitCount = 0;
  let mergeCount = 0;
  for (const result of commits) {
    if (DateTime.fromISO(result.authored_date).hasSame(date, 'day')) {
      commitCount += 1;
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
  const { startDate, endDate } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const [emails, setEmails] = useState<string[]>([]);
  const { data: commits } = useGetCommits(
    {
      repository: repositoryId,
      author_email: emails,
      start_date: startDate,
      end_date: endDate,
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
      <Container>
        <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
        <Container maxWidth='md'>
          <Grid container alignItems='flex-end' spacing={1}>
            <Grid item xs={8}>
              <CalendarFilter />
            </Grid>
            <Grid item xs={4}>
              <Box mb={1}>
                <MemberDropdown
                  repositoryId={repositoryId}
                  onChange={(newEmails) => {
                    setEmails(newEmails);
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box my={2}>
          <Tabs
            value={graphType}
            onChange={handleTabs}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab label='Codes' />
            <Tab label='Scores' />
            <Tab label='Comments' />
          </Tabs>
        </Box>
        <Grid justify='center' container>
          <DynamicBarChart graphData={graphData} graphType={graphType} />
        </Grid>
      </Container>
    </>
  );
};

export default DynamicGraph;
