import { Commit, Diff, MergeRequest } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { ApiResource } from '../../../api/base';
import { useGetDiffs } from '../../../api/diff';
import DiffView from '../../../components/DiffView';

interface CodeViewProps {
  mergeRequest?: ApiResource<MergeRequest>;
  commit?: ApiResource<Commit>;
}

const CodeView: React.FC<CodeViewProps> = ({ mergeRequest, commit }) => {
  const { data: diffs } = useGetDiffs(
    commit
      ? { commit: commit.meta.id }
      : { merge_request: mergeRequest.meta.id },
  );
  const [expandedDiffs, setExpandedDiffs] = useState<ApiResource<Diff>[]>([]);
  return (
    <Container>
      <Box my={2}>
        <Typography variant='h2'>
          {commit?.title || mergeRequest?.title}
        </Typography>
      </Box>
      <Box my={2}>
        <Button onClick={() => setExpandedDiffs(diffs?.results || [])}>
          Expand All
        </Button>
        <Button onClick={() => setExpandedDiffs([])}>Collapse All</Button>
      </Box>
      <Box>
        {diffs?.results.map((diff) => {
          const expanded = expandedDiffs.includes(diff);
          return (
            <DiffView
              key={diff.meta.id}
              fileName={diff.new_path}
              lines={diff.lines}
              summary={diff.summary}
              expanded={expanded}
              extensions={diff.extensions}
              onSummaryClick={() => {
                if (expanded) {
                  setExpandedDiffs(
                    expandedDiffs.filter((d) => d.meta.id !== diff.meta.id),
                  );
                } else {
                  setExpandedDiffs([...expandedDiffs, diff]);
                }
              }}
              allowEdit
            />
          );
        })}
      </Box>
    </Container>
  );
};

export default CodeView;
