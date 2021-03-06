import React from 'react';
import { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ListItem, List, Accordion } from '@material-ui/core';
import ItemBox from './itemBox';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';

interface UserNameProps {
  username: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    transition: theme.transitions.create('width'),
    overflow: 'hidden',
    minHeight: '100vh',
  },

  listCSS: {
    width: '14rem',
    position: 'relative',
    height: '100%',
  },
}));

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [open, setOpen] = useState(false);
  const { repositoryId } = useRepositoryContext();
  return (
    <>
      <div
        style={open ? { width: '14rem' } : { width: '4rem' }}
        className={styles.root}
      >
        <List className={styles.listCSS}>
          <ListItem button onClick={() => setOpen(!open)}>
            <ItemBox icon='collapse' primary={'Collapse'} url='nil' />
          </ListItem>
          <ItemBox icon='user' primary={UserNameProps.username} url='/' />
          <ItemBox icon='repo' primary={'Repository'} url='/repository' />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <ItemBox icon='details' primary={'Details'} url='nil' />
            </AccordionSummary>
            <AccordionDetails>
              <ItemBox
                icon='merge'
                primary={'Merge Requests'}
                url={`/merge/${repositoryId}`}
                repositoryDependent
              />
            </AccordionDetails>
            <AccordionDetails>
              <ItemBox
                icon='commit'
                primary={'Commits'}
                url={`/commits?repository=${repositoryId}`}
                repositoryDependent
              />
            </AccordionDetails>
            <AccordionDetails>
              <ItemBox
                icon='members'
                primary={'Members'}
                url={`/repository/${repositoryId}/members`}
                repositoryDependent
              />
            </AccordionDetails>
          </Accordion>
          <ItemBox
            icon='graph'
            primary={'Graph'}
            url={`/graph/${repositoryId}`}
            repositoryDependent
          />

          <ItemBox icon='setting' primary={'Settings'} url='/settings' />
          <ItemBox icon='operation' primary={'Operations'} url='/operations' />
          <ItemBox icon='logout' primary={'Logout'} url='/logout' />
        </List>
      </div>
    </>
  );
};

export default NavBar;
