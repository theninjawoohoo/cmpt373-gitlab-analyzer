import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useParams } from 'react-router-dom';
import { useCommitDailyCounts } from '../../api/commit';
import { DateTime } from 'luxon';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { useFilterContext } from '../../contexts/FilterContext';
import DynamicBarChart from './BarChartComponent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

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
  const { startDate, endDate, emails } = useFilterContext();
  const { id } = useParams<{ id: string }>();
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
      <Container>
        <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
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
