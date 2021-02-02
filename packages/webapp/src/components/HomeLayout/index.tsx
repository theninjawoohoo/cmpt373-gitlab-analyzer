import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useAuthContext } from "../../contexts/AuthContext";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: "2rem",
      textAlign: "center",
    },

    paperBlock: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: 300,
      maxHeight: 400,
    },

    center: {
      textAlign: "center",
    },
  })
);

const HomeLayout: React.FC = ({ children }) => {
  const styles = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  return (
    <>
      {/* <Paper className={styles.paperBlock} elevation={3}> */}
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Typography variant="h1" className={styles.title}>
            GitLab Analyzer
          </Typography>
        </Grid>
        <Grid item>
          <Link href="https://cas.sfu.ca?service=http://localhost:3000/login/sfu">
            <div className={styles.center}>
              <Button variant="contained" color="inherit">
                Log in via SFU
              </Button>
            </div>
          </Link>
        </Grid>
      </Grid>
      {/* </Paper> */}
    </>
  );
};

// export function SimplePaper() {
//   const classes = useStyles();

//   return (
//     <div className={classes.paperBlock}>
//       <Paper elevation={3} />
//     </div>
//   );
// }

export default HomeLayout;
