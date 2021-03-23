import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Link } from 'react-router-dom';
import DefaultPageLayout from '../../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../../components/DefaultPageTitleFormat';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from 'react-router-dom';

interface ScoringLayoutProps {
  showCreateButton?: boolean;
}

const ScoringLayout: React.FC<ScoringLayoutProps> = ({
  children,
  showCreateButton,
}) => {
  const { push } = useHistory();
  return (
    <DefaultPageLayout>
      <Container>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <DefaultPageTitleFormat>Scoring Config</DefaultPageTitleFormat>
          </Grid>
          <Grid item>
            <IconButton onClick={() => push('/settings')}>
              <CancelIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          container
          direction='column'
          alignItems='stretch'
          justify='space-between'
          spacing={2}
        >
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
          <Grid item>{children}</Grid>
        </Grid>
      </Container>
    </DefaultPageLayout>
  );
};

export default ScoringLayout;
