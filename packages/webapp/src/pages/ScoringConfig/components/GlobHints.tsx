import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const Pattern = styled(Typography)`
  font-family: monospace;
`;

const GlobHints: React.FC = () => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography>File Pattern Hints (click to expand)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography>Pattern</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Match</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Not Match</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={4}>
            <Pattern>*.py</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>file.py</Pattern>
            <Pattern>nested/folder/file.py</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>nested/folder/file.python</Pattern>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={4}>
            <Pattern>package*.json</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>package.json</Pattern>
            <Pattern>packages/api/package.json</Pattern>
            <Pattern>packages/api/package-lock.json</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>nested/folder/file.json</Pattern>
            <Pattern>lock-package.json</Pattern>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={4}>
            <Pattern>packages/types/src/*.ts</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>packages/types/src/User.ts</Pattern>
            <Pattern>packages/types/src/File.config.ts</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>file.ts</Pattern>
            <Pattern>packages/types/src/nested/file.ts</Pattern>
            <Pattern>packages/webapp/src/file.ts</Pattern>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={4}>
            <Pattern>packages/*/src/**/*.ts</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>package/pdf/src/User.ts</Pattern>
            <Pattern>package/types/src/nest/File.config.ts</Pattern>
          </Grid>
          <Grid item xs={4}>
            <Pattern>packages/types/test.ts</Pattern>
            <Pattern>webapp/src/file.ts</Pattern>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default GlobHints;
