import { Diff } from '@ceres/types';
import { Container } from '@material-ui/core';
import { parse } from 'querystring';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetDiffs } from '../../api/diff';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DiffView from '../../components/DiffView';
import { ApiResource } from '../../api/base';
import Button from '@material-ui/core/Button/Button';
import Box from '@material-ui/core/Box';

const DiffCommit: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));
  const { data } = useGetDiffs(
    {
      commit: query.commit as string,
      merge_request: query.merge_request as string,
    },
    0,
    50,
  );
  const [expandedDiffs, setExpandedDiffs] = useState<ApiResource<Diff>[]>([]);
  return (
    <DefaultPageLayout>
      <Container>
        <h1>Commit Diffs</h1>
        <Box my={2}>
          <Button onClick={() => setExpandedDiffs(data?.results || [])}>
            Expand All
          </Button>
          <Button onClick={() => setExpandedDiffs([])}>Collapse All</Button>
        </Box>
        {data?.results.map((diff) => {
          const expanded = expandedDiffs.includes(diff);
          return (
            <DiffView
              key={diff.meta.id}
              fileName={diff.new_path}
              lines={diff.lines}
              expanded={expanded}
              onSummaryClick={() => {
                if (expanded) {
                  setExpandedDiffs(
                    expandedDiffs.filter((d) => d.meta.id !== diff.meta.id),
                  );
                } else {
                  setExpandedDiffs([...expandedDiffs, diff]);
                }
              }}
            />
          );
        })}
      </Container>
    </DefaultPageLayout>
  );
};

export default DiffCommit;
