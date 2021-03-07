import React from 'react';
import { useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { ListItem, List } from '@material-ui/core';
import ItemBox from './itemBox';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

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

const Accordion = withStyles({
  root: {
    border: '0px',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderBottom: '0px',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '0 auto',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiAccordionDetails);

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
              <ItemBox icon='list' primary={'Details'} url='nil' />
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
                icon='graph'
                primary={'Graph'}
                url={`/graph/${repositoryId}`}
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
          <ItemBox icon='setting' primary={'Settings'} url='/settings' />
          <ItemBox icon='operation' primary={'Operations'} url='/operations' />
          <ItemBox icon='logout' primary={'Logout'} url='/logout' />
        </List>
      </div>
    </>
  );
};

export default NavBar;
