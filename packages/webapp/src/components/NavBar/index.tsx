import React from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
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
    minHeight: '120vh',
  },

  listCSS: {
    width: '100rem',
    position: 'relative',
    height: '100%',
    backgroundColor: '#1D3945',
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
    backgroundColor: '#1D3945',
    borderBottom: '0px',
    marginBottom: -1,
    minHeight: '5em',
    width: '6rem',
    '&$expanded': {
      minHeight: '5rem',
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
    width: '6rem',
    backgroundColor: '#1D3945',
    padding: theme.spacing(0),
    minHeight: '7rem',
  },
}))(MuiAccordionDetails);

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { repositoryId } = useRepositoryContext();
  return (
    <>
      <div style={{ width: '6rem' }} className={styles.root}>
        <List className={styles.listCSS}>
          <ItemBox icon='user' primary={UserNameProps.username} url='/' />
          <ItemBox
            icon='repo'
            primary={'Repository'}
            url={repositoryId ? `/repository/${repositoryId}` : '/repository'}
          />
          <Accordion>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  style={{ color: 'white', backgroundColor: '#1D3945' }}
                />
              }
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
          <ItemBox icon='scoring' primary={'Scoring'} url='/scoring' />
          <ItemBox icon='logout' primary={'Logout'} url='/logout' />
        </List>
      </div>
    </>
  );
};

export default NavBar;
