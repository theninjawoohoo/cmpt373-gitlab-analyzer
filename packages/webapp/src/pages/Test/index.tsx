import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Paper } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    paper: {
      width: '100%',
      marginLeft: 5,
      marginBottom: 10,
      padding: 15,
    },
  }),
);

const Comment = () => {
  const classes = useStyles();

  const [commentType, setCommentType] = useState(0);

  const handleTabs = (event: React.ChangeEvent<unknown>, newType: number) => {
    setCommentType(newType);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Comments</DefaultPageTitleFormat>
        <Box my={2} className={classes.root}>
          <Tabs
            value={commentType}
            onChange={handleTabs}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab label='Code Reviews' />
            <Tab label='Issue Notes' />
          </Tabs>
        </Box>
        <Grid
          justify='center'
          container
          direction={'column'}
          alignItems={'stretch'}
          spacing={1}
        >
          <Paper elevation={3} className={classes.paper}>
            <Grid justify={'space-between'} alignItems={'center'}>
              <Typography>
                <Box fontSize={18} paddingBottom={1.5}>
                  On merge request{' '}
                  <Box fontWeight='fontWeightBold' display='inline'>
                    Link-to-merge-request
                  </Box>
                </Box>
              </Typography>
            </Grid>
            <Grid
              alignItems={'flex-start'}
              container
              direction={'row'}
              spacing={2}
            >
              <Grid
                item
                xs={2}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Typography>
                  <Box fontWeight='fontWeightBold' display='inline'>
                    Author X
                  </Box>{' '}
                  wrote:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  This should display the content body of the code review from a
                  merge request or commit code diff, or the note issue on an
                  issue.
                </Typography>
                <Typography variant={'body2'} align={'right'}>
                  <Box fontSize={16} fontStyle={'italic'} marginTop={2}>
                    Date and time of the comment
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align={'right'}>
                  <Box
                    fontWeight={'fontWeightBold'}
                    fontSize={20}
                    marginRight={2}
                  >
                    Word Count
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} className={classes.paper}>
            <Grid justify={'space-between'} alignItems={'center'}>
              <Typography>
                <Box fontSize={18} paddingBottom={1.5}>
                  On merge request{' '}
                  <Box fontWeight='fontWeightBold' display='inline'>
                    Link-to-merge-request
                  </Box>
                </Box>
              </Typography>
            </Grid>
            <Grid
              alignItems={'flex-start'}
              container
              direction={'row'}
              spacing={2}
            >
              <Grid
                item
                xs={2}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Typography>
                  <Box fontWeight='fontWeightBold' display='inline'>
                    Author X
                  </Box>{' '}
                  wrote:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  This should display the content body of the code review from a
                  merge request or commit code diff, or the note issue on an
                  issue.
                </Typography>
                <Typography variant={'body2'} align={'right'}>
                  <Box fontSize={16} fontStyle={'italic'} marginTop={2}>
                    Date and time of the comment
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align={'right'}>
                  <Box
                    fontWeight={'fontWeightBold'}
                    fontSize={20}
                    marginRight={2}
                  >
                    Word Count
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </>
  );
};

export default Comment;
