import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchGroupConfigs } from '../../api/groupConfig';
import SmartDate from '../../components/SmartDate';
import GroupLayout from './components/GroupLayout';

const BrowseGroupConfigPage: React.FC = () => {
  const { data } = useSearchGroupConfigs();
  return (
    <GroupLayout showCreateButton showBackButton>
      <Box mx={2}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant='h3'>Name</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Last Updated</Typography>
          </Grid>
        </Grid>
      </Box>
      <List>
        {data?.results?.map((groupConfig) => (
          <ListItem
            key={groupConfig.meta.id}
            button
            component={Link}
            to={`/settings/group/edit?id=${groupConfig.meta.id}`}
          >
            <Grid item xs={6}>
              <Typography>{groupConfig.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <SmartDate>{groupConfig.meta.updatedAt}</SmartDate>
              </Typography>
            </Grid>
          </ListItem>
        ))}
      </List>
    </GroupLayout>
  );
};

export default BrowseGroupConfigPage;
