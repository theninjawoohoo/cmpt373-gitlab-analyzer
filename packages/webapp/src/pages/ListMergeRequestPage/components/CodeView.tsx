import {
  Commit,
  Diff,
  MergeRequest,
  Repository,
  ScoreOverride,
} from '@ceres/types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { ApiResource } from '../../../api/base';
import { useGetDiffs } from '../../../api/diff';
import DiffView from '../../../components/DiffView';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ScoreOverrideForm from './ScoreOverrideForm';
import { useScoreOverrideQueue } from '../contexts/ScoreOverrideQueue';
import { useRepositoryContext } from '../../../contexts/RepositoryContext';
import { useGetRepository } from '../../../api/repository';
import { useAuthContext } from '../../../contexts/AuthContext';

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
  const { repositoryId } = useRepositoryContext();
  const { data: repository } = useGetRepository(repositoryId);
  const { user } = useAuthContext();
  const isOwner = user?.id === repository?.extensions?.owner?.id;
  const collaborators = repository?.extensions?.collaborators || [];
  const allowEdit =
    isOwner ||
    !!collaborators.find(
      (collaborator) =>
        collaborator.id === user?.id &&
        collaborator.accessLevel === Repository.AccessLevel.editor,
    );
  const [anchor, setAnchor] = useState(null);
  const [openOverride, setOpenOverride] = useState(false);
  const { add } = useScoreOverrideQueue();
  const [expandedDiffs, setExpandedDiffs] = useState<ApiResource<Diff>[]>([]);
  const defaultScore =
    commit?.extensions?.score || mergeRequest?.extensions?.diffScore;
  const score = ScoreOverride.computeScore(
    (commit || mergeRequest)?.extensions?.override,
    defaultScore,
  );

  const onScoreEdit = (e: MouseEvent) => {
    // prevent the accordion from toggling
    e.stopPropagation();
    setOpenOverride(!openOverride);
    setAnchor(anchor ? null : e.currentTarget);
  };

  const onPopperClickAway = () => {
    setOpenOverride(false);
    setAnchor(null);
  };

  const onSubmitPopper = (values: ScoreOverride) => {
    add({
      id: `${commit ? 'Commit' : 'MergeRequest'}/${
        (commit || mergeRequest).meta.id
      }`,
      display: commit
        ? 'Commit: '
        : 'MergeRequest: ' + (commit?.title || mergeRequest?.title),
      previousScore: score,
      defaultScore,
      override: {
        ...values,
        score: values.score ? +values.score : undefined,
      },
    });
    onPopperClickAway();
  };

  return (
    <Container>
      <Box my={2}>
        <Grid
          container
          justify='space-between'
          alignItems='flex-start'
          spacing={4}
        >
          <Grid item>
            <Typography variant='h2'>
              {commit?.title || mergeRequest?.title}
            </Typography>
          </Grid>
          <Grid item>
            {allowEdit && (
              <Grid item>
                <IconButton onClick={onScoreEdit as any}>
                  <EditIcon />
                </IconButton>
                <ScoreOverrideForm
                  open={openOverride}
                  anchor={anchor}
                  onClickAway={onPopperClickAway}
                  onSubmit={onSubmitPopper}
                  defaultValues={(commit || mergeRequest)?.extensions?.override}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box my={2}>
        <Button onClick={() => setExpandedDiffs(diffs?.results || [])}>
          Expand All
        </Button>
        <Button onClick={() => setExpandedDiffs([])}>Collapse All</Button>
        <Button
          variant='text'
          color={'primary'}
          endIcon={<CallMadeIcon />}
          onClick={
            commit?.web_url
              ? () => window.open(commit.web_url)
              : () => window.open(mergeRequest.web_url)
          }
        >
          View on GitLab
        </Button>
      </Box>
      <Box>
        {diffs?.results.map((diff) => {
          const expanded = expandedDiffs.includes(diff);
          return (
            <DiffView
              key={diff.meta.id}
              diffId={diff.meta.id}
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
              allowEdit={allowEdit}
            />
          );
        })}
      </Box>
    </Container>
  );
};

export default CodeView;
