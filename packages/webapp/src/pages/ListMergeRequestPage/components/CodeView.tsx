import { Diff, MergeRequest } from '@ceres/types';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { ApiResource } from '../../../api/base';
import { useGetDiffs } from '../../../api/diff';
import DiffView from '../../../components/DiffView';

interface CodeViewProps {
  mergeRequest: ApiResource<MergeRequest>;
}

const CodeView: React.FC<CodeViewProps> = ({ mergeRequest }) => {
  const { data: diffs } = useGetDiffs({
    merge_request: mergeRequest.meta.id,
  });
  const [expandedDiffs, setExpandedDiffs] = useState<ApiResource<Diff>[]>([]);
  return (
    <div>
      <Typography variant='h2'>{mergeRequest.title}</Typography>
      {diffs?.results.map((diff) => {
        const expanded: boolean = expandedDiffs.includes(diff);
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
    </div>
  );
};

export default CodeView;
