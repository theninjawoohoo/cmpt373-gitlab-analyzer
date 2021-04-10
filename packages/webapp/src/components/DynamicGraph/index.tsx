import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { useFilterContext } from '../../contexts/FilterContext';
import DynamicBarChart from './BarChartComponent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useGetCountMergeRequests } from '../../api/mergeRequests';
import { useGetCountCommits } from '../../api/commit';
import { Commit, MergeRequest } from '@ceres/types';
import { uniq } from 'lodash';
import { DateTime } from 'luxon';
import { isSameDay } from 'date-fns';

function combineData(
  startDate: string,
  endDate: string,
  commitCounts: Commit.DailyCount[] = [],
  mergeRequestCounts: MergeRequest.DailyCount[] = [],
) {
  const allDates = uniq([
    ...commitCounts.map((count) => count.date),
    ...mergeRequestCounts.map((count) => count.date),
  ]).sort((a, b) => a.localeCompare(b));
  const startDateRounded = DateTime.fromISO(startDate)
    .startOf('day')
    .toJSDate();
  const earliestDateDatset = new Date(allDates[0]);
  const endDateRounded = DateTime.fromISO(endDate).startOf('day').toJSDate();
  let date =
    startDateRounded < earliestDateDatset
      ? startDateRounded
      : earliestDateDatset;
  const dates: Date[] = [];
  while (date <= endDateRounded) {
    dates.push(date);
    date = DateTime.fromISO(date.toISOString()).plus({ days: 1 }).toJSDate();
  }
  return dates.map((date) => ({
    date: date.toISOString(),
    commitCount:
      commitCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.count || 0,
    commitScore:
      commitCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.score || 0,
    mergeRequestCount:
      -mergeRequestCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.count || 0,
    mergeRequestScore:
      -mergeRequestCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.score || 0,
  }));
}

export enum GraphTab {
  code = 'code',
  scores = 'scores',
  comments = 'comments',
}

const DynamicGraph: React.FC = () => {
  const { startDate, endDate, emails } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: commitCounts } = useGetCountCommits({
    repository: repositoryId,
    author_email: emails,
    start_date: startDate,
    end_date: endDate,
    sort: '+authored_date',
  });
  const { data: mergeRequestCounts } = useGetCountMergeRequests({
    repository: repositoryId,
    author_email: emails,
    merged_start_date: startDate,
    merged_end_date: endDate,
  });
  const [graphTab, setGraphTab] = useState(GraphTab.code);
  const graphData = combineData(
    startDate,
    endDate,
    commitCounts || [],
    mergeRequestCounts || [],
  );

  const handleTabs = (event: React.ChangeEvent<unknown>, newTab: GraphTab) => {
    setGraphTab(newTab);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
        <Box my={2}>
          <Tabs
            value={graphTab}
            onChange={handleTabs}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab label='Codes' value={GraphTab.code} />
            <Tab label='Scores' value={GraphTab.scores} />
            <Tab label='Comments' value={GraphTab.comments} />
          </Tabs>
        </Box>
        <Grid justify='center' container>
          <DynamicBarChart graphData={graphData} graphTab={graphTab} />
        </Grid>
      </Container>
    </>
  );
};

export default DynamicGraph;
