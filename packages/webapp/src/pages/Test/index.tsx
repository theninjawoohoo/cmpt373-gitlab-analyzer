import React from 'react';
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useBigTableStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const useTablePaginationStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }),
);

const TableCellInstance = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#1b3843',
      color: theme.palette.common.white,
      fontWeight: 600,
      fontSize: 16,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const createMergeRequestRow = (
  id: string,
  date: string,
  title: string,
  createdBy: string,
  score: number,
  commentsNumber: number,
) => {
  return { id, date, title, createdBy, score, commentsNumber };
};

const rows = [
  createMergeRequestRow(
    '0001',
    'Dec 8, 2020',
    'Change dark mode accent',
    'Tracy McConnell',
    24,
    1,
  ),
  createMergeRequestRow(
    '0002',
    'Dec 8, 2020',
    "Search by employees' names and skills on map",
    'Ted Mosby',
    38,
    9,
  ),
  createMergeRequestRow(
    '0003',
    'Dec 7, 2020',
    'Final UI touchups',
    'Marshall Eriksen',
    25,
    2,
  ),
  createMergeRequestRow(
    '0004',
    'Dec 6, 2020',
    "Auto link emergency information in employee's info",
    'Marshall Eriksen',
    10,
    0,
  ),
  createMergeRequestRow(
    '0005',
    'Dec 6, 2020',
    'Force portrait mode for the app',
    'Lily Aldrin',
    5,
    0,
  ),
  createMergeRequestRow(
    '0006',
    'Dec 5, 2020',
    'App internationalization',
    'Robin Scherbatsky',
    85,
    3,
  ),
  createMergeRequestRow(
    '0007',
    'Dec 3, 2020',
    'Fix crash in activity add day leave',
    'Ted Mosby',
    25,
    1,
  ),
  createMergeRequestRow(
    '0008',
    'Dec 2, 2020',
    'Finish up map and sidebar',
    'Tracy McConnell',
    45,
    2,
  ),
  createMergeRequestRow(
    '0009',
    'Nov 25, 2020',
    'Add new communication activity for each employee',
    'Barney Stinson',
    15,
    0,
  ),
  createMergeRequestRow(
    '0010',
    'Nov 22, 2020',
    'Live search on map',
    'Tracy McConnell',
    35,
    0,
  ),
  createMergeRequestRow(
    '0011',
    'Nov 20, 2020',
    'Site map Info UI',
    'Ted Mosby',
    55,
    8,
  ),
  createMergeRequestRow(
    '0012',
    'Nov 18, 2020',
    'Add feature change password for user',
    'Lily Aldrin',
    32,
    1,
  ),
  createMergeRequestRow(
    '0013',
    'Nov 18, 2020',
    'Add logout screen and functionality',
    'Lily Aldrin',
    33,
    0,
  ),
  createMergeRequestRow(
    '0014',
    'Nov 16, 2020',
    'Implement sidebar',
    'Robin Scherbatsky',
    48,
    0,
  ),
  createMergeRequestRow(
    '0015',
    'Nov 16, 2020',
    'Fix save user info button to save in SharedPreferences',
    'Marshall Eriksen',
    20,
    6,
  ),
  createMergeRequestRow(
    '0016',
    'Nov 14, 2020',
    'Refix Android back button to kill all activities on the stack.',
    'Tracy McConnell',
    16,
    5,
  ),
  createMergeRequestRow(
    '0017',
    'Nov 9, 2020',
    'Create database firebase for app',
    'Ted Mosby',
    93,
    2,
  ),
  createMergeRequestRow(
    '0018',
    'Nov 9, 2020',
    'Add bottom navigation bar for activities',
    'Robin Scherbatsky',
    68,
    0,
  ),
  createMergeRequestRow(
    '0019',
    'Nov 8, 2020',
    'Add Google map and OnClickListener for site recyclerView.',
    'Tracy McConnell',
    56,
    0,
  ),
  createMergeRequestRow(
    '0020',
    'Nov 6, 2020',
    'Created UserInfo UI + Fixed LoginInfoActivity Crash',
    'Lily Aldrin',
    44,
    1,
  ),
  createMergeRequestRow(
    '0021',
    'Nov 3, 2020',
    'Implement Communication Activity',
    'Barney Stinson',
    62,
    10,
  ),
];

interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

const TablePaginationActions: React.FC<TablePaginationProps> = (
  TablePaginationProps,
) => {
  const classes = useTablePaginationStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = TablePaginationProps;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
};

const MergeRequestsTable = () => {
  const classes = useBigTableStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleRowClick = (title: string) => {
    alert(`Merge request "${title}" was selected.`);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='merge requests table'>
        <TableHead>
          <TableRow>
            <TableCellInstance>Date</TableCellInstance>
            <TableCellInstance>Title</TableCellInstance>
            <TableCellInstance>Created&nbsp;by</TableCellInstance>
            <TableCellInstance>Score</TableCellInstance>
            <TableCellInstance>Number&nbsp;of&nbsp;comments</TableCellInstance>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.id} onClick={() => handleRowClick(row.title)}>
              <TableCellInstance>{row.date}</TableCellInstance>
              <TableCellInstance style={{ fontWeight: 600 }}>
                {row.title}
              </TableCellInstance>
              <TableCellInstance>{row.createdBy}</TableCellInstance>
              <TableCellInstance>{row.score}</TableCellInstance>
              <TableCellInstance>{row.commentsNumber}</TableCellInstance>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25, { label: 'All', value: -1 }]}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default MergeRequestsTable;
