import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Link } from 'react-router-dom';
import DefaultPageLayout from '../../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../../components/DefaultPageTitleFormat';

interface ScoringLayoutProps {
  showCreateButton?: boolean;
}

const ScoringLayout: React.FC<ScoringLayoutProps> = ({
  children,
  showCreateButton,
}) => {
  return (
    <DefaultPageLayout>
      <Container>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <DefaultPageTitleFormat>Scoring Config</DefaultPageTitleFormat>
          </Grid>
          <Grid item>
            {showCreateButton ? (
              <Button
                variant='contained'
                color='primary'
                size='large'
                component={Link}
                to='/scoring/edit'
              >
                Create
              </Button>
            ) : (
              <Button
                variant='contained'
                color='secondary'
                component={Link}
                to='/scoring'
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
        {children}
      </Container>
    </DefaultPageLayout>
  );
};

export default ScoringLayout;
