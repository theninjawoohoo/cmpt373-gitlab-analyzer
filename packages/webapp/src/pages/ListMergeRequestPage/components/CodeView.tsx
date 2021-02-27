import { Diff, MergeRequest } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ApiResource } from '../../../api/base';
import { useGetDiffs } from '../../../api/diff';
import DiffView from '../../../components/DiffView';

interface CodeViewProps {
  mergeRequest: ApiResource<MergeRequest>;
}

const Root = styled.div`
  position: relative;
  min-height: 99vh;
  max-height: 99vh;
  overflow: scroll;
`;

const Header = styled.div`
  position: fixed;
  height: 8rem;
  z-index: 100;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
`;

const CodeView: React.FC<CodeViewProps> = ({ mergeRequest }) => {
  const { data: diffs } = useGetDiffs({
    merge_request: mergeRequest.meta.id,
  });
  const [expandedDiffs, setExpandedDiffs] = useState<ApiResource<Diff>[]>([]);
  return (
    <Root>
      <Header>
        <Box my={2}>
          <Typography variant='h2'>{mergeRequest.title}</Typography>
        </Box>
        <Box my={2}>
          <Button onClick={() => setExpandedDiffs(diffs?.results || [])}>
            Expand All
          </Button>
          <Button onClick={() => setExpandedDiffs([])}>Collapse All</Button>
        </Box>
      </Header>
      <Box height='8rem' />
      <Box overflow='scroll'>
        {diffs?.results.map((diff) => {
          const expanded = expandedDiffs.includes(diff);
          return (
            <DiffView
              key={diff.meta.id}
              fileName={diff.new_path}
              hunks={diff.hunks}
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
      </Box>
    </Root>
  );
};

export default CodeView;
