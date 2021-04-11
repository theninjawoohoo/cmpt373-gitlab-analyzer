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
import { Commit, MergeRequest, Note, RepositoryMember } from '@ceres/types';
import { uniq } from 'lodash';
import { DateTime } from 'luxon';
import { isSameDay } from 'date-fns';
import { useGetWordCount } from '../../api/note';
import { useRepositoryMembers } from '../../api/repo_members';
import { ApiResource } from '../../api/base';

function combineData(
  startDate: string,
  endDate: string,
  commitCounts: Commit.DailyCount[] = [],
  mergeRequestCounts: MergeRequest.DailyCount[] = [],
  issueWordCounts: Note.DailyCount[] = [],
  mergeRequestWordCounts: Note.DailyCount[] = [],
) {
  const allDates = uniq([
    ...commitCounts.map((count) => count.date),
    ...mergeRequestCounts.map((count) => count.date),
    ...issueWordCounts.map((count) => count.date),
    ...mergeRequestWordCounts.map((count) => count.date),
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
    issueWordCount:
      -issueWordCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.wordCount || 0,
    mergeRequestWordCount:
      mergeRequestWordCounts.find((count) =>
        isSameDay(date, new Date(count.date)),
      )?.wordCount || 0,
  }));
}

export enum GraphTab {
  code = 'code',
  scores = 'scores',
  comments = 'comments',
}

function findRepoMemberId(
  filtered_id: string,
  members: ApiResource<RepositoryMember>[],
) {
  const filtered = (members || []).filter(
    (member) => member.meta.id === filtered_id,
  );
  return filtered.map((member) => member.id);
}

const DynamicGraph: React.FC = () => {
  const { startDate, endDate, emails, author } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: members } = useRepositoryMembers(repositoryId);
  const authorIds = findRepoMemberId(author, members);
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
  const { data: issueWordCounts } = useGetWordCount({
    repository_id: repositoryId,
    created_start_date: startDate,
    created_end_date: endDate,
    author_id: authorIds,
    type: Note.Type.issueComment,
  });
  const { data: mergeRequestWordCounts } = useGetWordCount({
    repository_id: repositoryId,
    created_start_date: startDate,
    created_end_date: endDate,
    author_id: authorIds,
    type: Note.Type.mergeRequestComment,
  });

  const [graphTab, setGraphTab] = useState(GraphTab.code);
  const graphData = combineData(
    startDate,
    endDate,
    commitCounts || [],
    mergeRequestCounts || [],
    issueWordCounts || [],
    mergeRequestWordCounts || [],
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
