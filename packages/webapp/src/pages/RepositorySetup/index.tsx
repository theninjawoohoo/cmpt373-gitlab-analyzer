import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  AddCollaboratorPayload,
  RemoveCollaboratorPayload,
  useAddCollaborator,
  useGetRepository,
  useRemoveCollaborator,
} from '../../api/repository';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import SmartDate from '../../components/SmartDate';
import { useAuthContext } from '../../contexts/AuthContext';
import Collaborators from '../RepositorySetup/components/Collaborators';
import LeaveRepository from '../RepositorySetup/components/LeaveRepository';
import MembersWarning from '../RepositorySetup/components/MembersWarning';
import ScoringConfigWarning from '../RepositorySetup/components/ScoringConfigWarning';
import ScoringConfigSelector from './components/ScoringConfigSelector';
import { useUpdateScoring } from '../../api/scoring';
import { ApiResource } from '../../api/base';
import { ScoringConfig } from '@ceres/types';
import RepoFilter from '../../components/RepositoryFilter';
import styled from 'styled-components';
import AccordionMenu from './components/AccordionMenu';
import Members from '../Members';

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`;

const RepoSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useHistory();
  const {
    mutate: updateScoring,
    isLoading: updateScoreLoading,
  } = useUpdateScoring();
  const { user } = useAuthContext();
  const { data, invalidate } = useGetRepository(id);
  const { mutate: addCollaborator } = useAddCollaborator(id);
  const { mutate: removeCollaborator } = useRemoveCollaborator(id);
  const { enqueueSnackbar } = useSnackbar();
  const isOwner = user?.id === data?.extensions?.owner?.id;
  const collaborators = data?.extensions?.collaborators || [];

  const handleUpdateScore = (scoringConfig: ApiResource<ScoringConfig>) => {
    updateScoring(
      {
        repositoryId: id,
        scoringConfigId: scoringConfig?.meta?.id,
      },
      {
        onSuccess: () => {
          void invalidate();
        },
      },
    );
  };

  const handleAddCollaborator = (payload: AddCollaboratorPayload) => {
    addCollaborator(payload, {
      onSuccess: invalidate,
    });
  };

  const handleRemoveCollaborator = (payload: RemoveCollaboratorPayload) => {
    removeCollaborator(payload, {
      onSuccess: invalidate,
    });
  };

  const handleLeave = () => {
    removeCollaborator(
      { collaboratorId: user.id },
      {
        onSuccess: () => {
          push('/repository');
          enqueueSnackbar('You have left the snapshot.', {
            variant: 'success',
          });
        },
      },
    );
  };

  return (
    <DefaultPageLayout>
      <Container>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <DefaultPageTitleFormat>
              {data?.name_with_namespace}
            </DefaultPageTitleFormat>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Created at:</strong>{' '}
              <SmartDate>{data?.created_at}</SmartDate>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Last synced:</strong>{' '}
              <SmartDate>{data?.extensions?.lastSync}</SmartDate>
            </Typography>
          </Grid>
        </Grid>
        <MainContainer>
          <MembersWarning repositoryId={id} />
          <ScoringConfigWarning repository={data} repositoryId={id} />
          <AccordionMenu title='Filter Config' color='#e4f5ba'>
            <Grid item xs={12}>
              <RepoFilter />
            </Grid>
          </AccordionMenu>
          <AccordionMenu title='Members' color='#ffd9cf'>
            <Members id={id} />
          </AccordionMenu>
          <AccordionMenu title='Scoring Rubric' color='#cff4fc'>
            {data && isOwner && (
              <ScoringConfigSelector
                isLoading={updateScoreLoading}
                onSubmit={handleUpdateScore}
                repository={data}
              />
            )}
          </AccordionMenu>
          <AccordionMenu
            title={`Sharing · ${collaborators.length} Collaborator(s)`}
            color='#e6d9ff'
          >
            {data && isOwner && (
              <Collaborators
                repository={data}
                onAddCollaborator={handleAddCollaborator}
                onRemoveCollaborator={handleRemoveCollaborator}
              />
            )}
            {data && !isOwner && (
              <LeaveRepository repository={data} onLeave={handleLeave} />
            )}
          </AccordionMenu>
        </MainContainer>
      </Container>
    </DefaultPageLayout>
  );
};

// const RepoSetupPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();

//   return (
//     <div>
//       <DefaultPageLayout>
//         <Container>
//           <Grid container direction='column' spacing={2}>
//             <Grid item>
//               <DefaultPageTitleFormat>Repository Setup</DefaultPageTitleFormat>
//             </Grid>
//             <Grid item xs={12}>
//               <LinkCard
//                 color='#e4f5ba'
//                 icon='members'
//                 to={`/setup/${id}/members`}
//               >
//                 Members
//               </LinkCard>
//             </Grid>
//             <Grid item xs={12}>
//               <LinkCard
//                 color='#ffd9cf'
//                 icon='rubric'
//                 to={`/setup/${id}/rubric`}
//               >
//                 Score Rubric
//               </LinkCard>
//             </Grid>
//           </Grid>
//         </Container>
//       </DefaultPageLayout>
//     </div>
//   );
// };

export default RepoSetupPage;
