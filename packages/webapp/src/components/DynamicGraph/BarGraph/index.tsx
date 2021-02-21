import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
// import { graphData } from './sampleData';
import { useCommitDailyCounts } from '../../../api/commit';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '100vh',
    widtch: '100vw',
  },
}));

interface GraphProps {
  repoID: string;
  studentName?: string;
  startDate: string;
  endDate: string;
}

const BarGraph: React.FC<GraphProps> = (GraphProps) => {
  const classes = useStyles();
  const { repoID, startDate, endDate } = GraphProps;
  const { data: commitCounts } = useCommitDailyCounts({
    repository: repoID,
    start_date: startDate,
    end_date: endDate,
  });
  const commits = commitCounts?.results || [];
  // const [graphData, setGraphData] = useState(commits);

  // useEffect(() => {
  //   if (studentName != 'All students') {
  //     setGraphData(
  //       commits.filter((commits) => commits.author_email == studentName),
  //     );
  //   } else {
  //     setGraphData(commits);
  //   }
  // }, [studentName, commits]);

  return (
    <BarChart width={1000} height={500} data={commits} className={classes.root}>
      <XAxis dataKey={commits.keys} />
      <YAxis />
      <Tooltip />
      <Legend layout='vertical' align='right' verticalAlign='top' />
      <Bar dataKey={commits.values} name='Commits' stackId='a' fill='#0A4D63' />
      {/* <Bar dataKey='mrs' name='Merge Requests' stackId='a' fill='#e37500' /> */}
    </BarChart>
  );
};

export default BarGraph;
