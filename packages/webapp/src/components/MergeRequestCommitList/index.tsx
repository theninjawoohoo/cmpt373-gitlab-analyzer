import React, { useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
import { useCommitsForMergeRequest } from '../../api/commit';
import { useFilterContext } from '../../contexts/FilterContext';

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

const MergeRequestCommitList: React.FC = () => {
  const classes = useBigTableStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { emails } = useFilterContext();
  const { id } = useParams<{ id: string }>();
  const { data: searchInterface } = useCommitsForMergeRequest(id);
  const rows = searchInterface?.results || [];
  const [results, setResults] = React.useState(rows);

  useEffect(() => {
    setResults(rows.filter((row) => emails.includes(row.author_email)));
  }, [emails]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, results?.length - page * rowsPerPage);

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
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='merge requests table'>
          <TableHead>
            <TableRow>
              <TableCellInstance>Date</TableCellInstance>
              <TableCellInstance>Title</TableCellInstance>
              <TableCellInstance>Commit Message</TableCellInstance>
              <TableCellInstance>Created&nbsp;by</TableCellInstance>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? results?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : results
            )?.map((row) => (
              <TableRow
                hover={true}
                key={row.id}
                onClick={() => handleRowClick(row.title)}
              >
                <TableCellInstance>
                  {row.created_at
                    .toString()
                    .slice(0, row.created_at.toString().indexOf('T'))}
                </TableCellInstance>
                <TableCellInstance>{row.title}</TableCellInstance>
                <TableCellInstance style={{ fontWeight: 600 }}>
                  {row.message}
                </TableCellInstance>
                <TableCellInstance>{row.author_name}</TableCellInstance>
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
                count={results?.length || 0}
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
    </>
  );
};

export default MergeRequestCommitList;
