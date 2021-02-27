import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMergeRequests } from '../../api/mergeRequests';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Container from '@material-ui/core/Container';
import MergeRequestRenderer from './components/MergeRequestRenderer';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const ListMergeRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeMergeRequest, setActiveMergeRequest] = useState<string>();
  const { data: mergeRequests } = useGetMergeRequests({ repository: id });
  return (
    <>
      <DefaultPageLayout>
        <Container>
          <Box bgcolor='red' pr={6} pl={2}>
            <Grid container>
              <Grid item xs={6}>
                Title
              </Grid>
              <Grid item xs={3}>
                Author
              </Grid>
              <Grid item xs={3}>
                Date
              </Grid>
            </Grid>
          </Box>
          {(mergeRequests?.results || []).map((mergeRequest) => {
            const active = mergeRequest.meta.id === activeMergeRequest;
            return (
              <MergeRequestRenderer
                key={mergeRequest.meta.id}
                mergeRequest={mergeRequest}
                active={active}
                onClickSummary={() => {
                  setActiveMergeRequest(
                    active ? undefined : mergeRequest.meta.id,
                  );
                }}
              />
            );
          })}
        </Container>
      </DefaultPageLayout>
    </>
  );
};

export default ListMergeRequestPage;
