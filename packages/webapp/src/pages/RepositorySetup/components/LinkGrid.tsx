import Grid from '@material-ui/core/Grid';
import React from 'react';
import LinkCard from '../../../components/LinkCard';

interface LinkGridProps {
  repositoryId: string;
}

const LinkGrid: React.FC<LinkGridProps> = ({ repositoryId }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <LinkCard color='#FFEDC0' icon='setup' to={`/setup/${repositoryId}`}>
          Repository Setup
        </LinkCard>
      </Grid>
      <Grid item xs={6}>
        <LinkCard color='#EFFFC0' icon='merge' to={`/merge/${repositoryId}`}>
          Merge Requests
        </LinkCard>
      </Grid>
      <Grid item xs={6}>
        <LinkCard color='#ffdeec' icon='graph' to={`/graph/${repositoryId}`}>
          Graphs
        </LinkCard>
      </Grid>
      <Grid item xs={6}>
        <LinkCard
          color='#C0E8FF'
          icon='commit'
          to={`/commits/?repository=${repositoryId}`}
        >
          Commits
        </LinkCard>
      </Grid>
    </Grid>
  );
};

export default LinkGrid;
