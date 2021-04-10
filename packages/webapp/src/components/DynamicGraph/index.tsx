import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useGetCommits } from '../../api/commit';
import { useGetCountMergeRequests } from '../../api/mergeRequests';
import { DateTime } from 'luxon';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { useFilterContext } from '../../contexts/FilterContext';
import DynamicBarChart from './BarChartComponent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import RepoFilter from '../../components/RepositoryFilter';
import { MergeRequest } from '@ceres/types';

const getCodeData = (
  date: DateTime,
  commits: any[],
  merges: MergeRequest.DailyCount,
  commit_index: number,
  merge_index: number,
) => {
  let commitCount = 0;
  let mergeCount = 0;
  let c_index = commit_index;
  let m_index = merge_index;
  for (let i = c_index; i < commits.length; i++) {
    const result = commits[i];
    if (DateTime.fromISO(result.authored_date).hasSame(date, 'day')) {
      commitCount += 1;
    } else {
      c_index = i;
      break;
    }
  }
  if (merges) {
    for (let j = m_index; j < Object.keys(merges).length; j++) {
      const result = merges[j];
      if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
        mergeCount -= result.count;
      } else {
        m_index = j;
        break;
      }
    }
  }

  return {
    date: date.toLocaleString(DateTime.DATE_MED),
    commitCount,
    mergeCount,
    c_index,
    m_index,
  };
};

const getScoreData = (
  date: DateTime,
  merges: MergeRequest.DailyCount,
  merge_index: number,
) => {
  let mergeScore = 0;
  let m_index = merge_index;
  if (merges) {
    for (let j = m_index; j < Object.keys(merges).length; j++) {
      const result = merges[j];
      if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
        mergeScore += result.score;
      } else {
        m_index = j;
        break;
      }
    }
  }

  return {
    date: date.toLocaleString(DateTime.DATE_MED),
    mergeScore,
    m_index,
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
    date: date.toLocaleString(DateTime.DATE_MED),
    wordCount,
  };
};

const DynamicGraph: React.FC = () => {
  const { startDate, endDate, emails } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: commits } = useGetCommits(
    {
      repository: repositoryId,
      author_email: emails,
      start_date: startDate,
      end_date: endDate,
      sort: '+authored_date',
    },
    0,
    9000,
  );
  const { data: merges } = useGetCountMergeRequests({
    repository: repositoryId,
    author_email: emails,
    merged_start_date: startDate,
    merged_end_date: endDate,
  });

  const [graphType, setGraphType] = useState(0); // 0 = code, 1 = score, 2 = comments
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      let date = DateTime.fromISO(startDate);
      let commit_index = 0;
      let merge_index = 0;
      const countsByDay = [];
      if (graphType == 0) {
        do {
          const codeData = getCodeData(
            date,
            commits?.results || [],
            merges,
            commit_index,
            merge_index,
          );
          const { date: day, commitCount, mergeCount } = codeData;
          commit_index = codeData.c_index;
          merge_index = codeData.m_index;
          countsByDay.push({ date: day, commitCount, mergeCount });
          date = date.plus({ days: 1 });
        } while (date <= DateTime.fromISO(endDate));
      } else if (graphType == 1) {
        do {
          const scoreData = getScoreData(date, merges, merge_index);
          const { date: day, mergeScore } = scoreData;
          merge_index = scoreData.m_index;
          countsByDay.push({ date: day, score: mergeScore });
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
  }, [graphType, commits?.results, merges, startDate, endDate]);

  const handleTabs = (event: React.ChangeEvent<unknown>, newType: number) => {
    setGraphType(newType);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
        <Container maxWidth='md'>
          <Grid container alignItems='flex-end' spacing={1}>
            <Grid item xs={12}>
              <RepoFilter />
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
        <Grid container alignItems='center' justify='center'>
          <DynamicBarChart graphData={graphData} graphType={graphType} />
        </Grid>
      </Container>
    </>
  );
};

export default DynamicGraph;
