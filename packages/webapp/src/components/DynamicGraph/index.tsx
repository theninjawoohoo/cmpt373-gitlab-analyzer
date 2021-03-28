import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useGetCommits } from '../../api/commit';
import { useGetMergeRequests } from '../../api/mergeRequests';
// import { useGetCountMergeRequests } from '../../api/mergeRequests';
import { DateTime } from 'luxon';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { useFilterContext } from '../../contexts/FilterContext';
import DynamicBarChart from './BarChartComponent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import RepoFilter from '../../components/RepositoryFilter';

const getCodeData = (
  date: DateTime,
  commits: any[],
  merges: any[],
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
  for (let j = m_index; j < merges.length; j++) {
    const result = merges[j];
    if (DateTime.fromISO(result.merged_at).hasSame(date, 'day')) {
      mergeCount -= 1;
    } else {
      m_index = j;
      break;
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

const getScoreData = (date: DateTime, scores: any[]) => {
  let score = 0;
  for (const result of scores) {
    if (DateTime.fromISO(result.date).hasSame(date, 'day')) {
      score += result.total_score;
    }
  }
  return {
    date: date.toLocaleString(DateTime.DATE_MED),
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
  const { data: merges } = useGetMergeRequests(
    {
      repository: repositoryId,
      author_email: emails,
      merged_start_date: startDate,
      merged_end_date: endDate,
    },
    0,
    9000,
  );
  // const { data: merges_test } = useGetCountMergeRequests({
  //   repository: repositoryId,
  //   author_email: emails,
  //   merged_start_date: startDate,
  //   merged_end_date: endDate,
  // });

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
            merges?.results || [],
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
  }, [graphType, commits?.results, merges?.results, startDate, endDate]);

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
        <Grid justify='center' container>
          <DynamicBarChart graphData={graphData} graphType={graphType} />
        </Grid>
      </Container>
    </>
  );
};

export default DynamicGraph;
