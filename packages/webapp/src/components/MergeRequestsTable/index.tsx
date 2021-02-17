import React from 'react';
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useBigTableStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const TableHeader = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const TableRowInstance = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const createMergeRequestRow = (
  date: string,
  title: string,
  createdBy: string,
  score: number,
  commentsNumber: number,
) => {
  return { date, title, createdBy, score, commentsNumber };
};

const rows = [
  createMergeRequestRow(
    'Dec 8, 2020',
    'Change dark mode accent',
    'Tracy McConnell',
    24,
    1,
  ),
  createMergeRequestRow(
    'Dec 8, 2020',
    "Search by employees' names and skills on map",
    'Ted Mosby',
    38,
    9,
  ),
  createMergeRequestRow(
    'Dec 7, 2020',
    'Final UI touchups',
    'Marshall Eriksen',
    25,
    2,
  ),
  createMergeRequestRow(
    'Dec 6, 2020',
    "Auto link emergency information in employee's info",
    'Marshall Eriksen',
    10,
    0,
  ),
  createMergeRequestRow(
    'Dec 6, 2020',
    'Force portrait mode for the app',
    'Lily Aldrin',
    5,
    0,
  ),
  createMergeRequestRow(
    'Dec 5, 2020',
    'App internationalization',
    'Robin Scherbatsky',
    85,
    3,
  ),
  createMergeRequestRow(
    'Dec 3, 2020',
    'Fix crash in activity add day leave',
    'Ted Mosby',
    25,
    1,
  ),
  createMergeRequestRow(
    'Dec 2, 2020',
    'Finish up map and sidebar',
    'Tracy McConnell',
    45,
    2,
  ),
  createMergeRequestRow(
    'Nov 25, 2020',
    'Add new communication activity for each employee',
    'Barney Stinson',
    15,
    0,
  ),
  createMergeRequestRow(
    'Nov 22, 2020',
    'Live search on map',
    'Tracy McConnell',
    35,
    0,
  ),
  createMergeRequestRow('Nov 20, 2020', 'Site map Info UI', 'Ted Mosby', 55, 8),
  createMergeRequestRow(
    'Nov 18, 2020',
    'Add feature change password for user',
    'Lily Aldrin',
    32,
    1,
  ),
  createMergeRequestRow(
    'Nov 18, 2020',
    'Add logout screen and functionality',
    'Lily Aldrin',
    33,
    0,
  ),
  createMergeRequestRow(
    'Nov 16, 2020',
    'Implement sidebar',
    'Robin Scherbatsky',
    48,
    0,
  ),
  createMergeRequestRow(
    'Nov 16, 2020',
    'Fix save user info button to save in SharedPreferences',
    'Marshall Eriksen',
    20,
    6,
  ),
  createMergeRequestRow(
    'Nov 14, 2020',
    'Refix Android back button to kill all activities on the stack.',
    'Tracy McConnell',
    16,
    5,
  ),
  createMergeRequestRow(
    'Nov 9, 2020',
    'Create database firebase for app',
    'Ted Mosby',
    93,
    2,
  ),
  createMergeRequestRow(
    'Nov 9, 2020',
    'Add bottom navigation bar for activities',
    'Robin Scherbatsky',
    68,
    0,
  ),
  createMergeRequestRow(
    'Nov 8, 2020',
    'Add Google map and OnClickListener for site recyclerView.',
    'Tracy McConnell',
    56,
    0,
  ),
  createMergeRequestRow(
    'Nov 6, 2020',
    'Created UserInfo UI + Fixed LoginInfoActivity Crash',
    'Lily Aldrin',
    44,
    1,
  ),
  createMergeRequestRow(
    'Nov 3, 2020',
    'Implement Communication Activity',
    'Barney Stinson',
    62,
    10,
  ),
];

const MergeRequestsTable = () => {
  const classes = useBigTableStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='customized table'>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader align='right'>Title</TableHeader>
            <TableHeader align='right'>Created&nbsp;by</TableHeader>
            <TableHeader align='right'>Score</TableHeader>
            <TableHeader align='right'>
              Number&nbsp;of&nbsp;comments
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRowInstance key={row.title}>
              <TableHeader component='th' scope='row'>
                {row.date}
              </TableHeader>
              <TableHeader align='right'>{row.title}</TableHeader>
              <TableHeader align='right'>{row.createdBy}</TableHeader>
              <TableHeader align='right'>{row.score}</TableHeader>
              <TableHeader align='right'>{row.commentsNumber}</TableHeader>
            </TableRowInstance>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MergeRequestsTable;
