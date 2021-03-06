import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { useAuthContext } from "../../contexts/AuthContext";
import UndecoratedLink from "../UndecoratedLink";
import { Repository } from "./Repository";

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontSize: "2rem",
  },
}));

const DefaultPageLayout: React.FC = ({ children }) => {
  const styles = useStyles();
  const { state: authState, dispatch } = useAuthContext();
  return (
    <>
      <AppBar>
        <Container>
          <Toolbar>
            <Typography variant="h2" className={styles.title}>
              GitLab Analyzer
            </Typography>
            <UndecoratedLink to="/">
              <Button color="inherit">Home</Button>
            </UndecoratedLink>
            {authState?.user?.sfuId ? (
              <>
                <UndecoratedLink to="/profile">
                  <Button color="inherit">{authState.user.sfuId}</Button>
                </UndecoratedLink>
                <Button
                  color="inherit"
                  onClick={() => dispatch({ type: "LOGOUT" })}
                >
                  Logout
                </Button>
              </>
            ) : (
              <UndecoratedLink to="/login">
                <Button color="inherit">Login</Button>
              </UndecoratedLink>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box height="4rem" />
      {children}
      <Repository />
    </>
  );
};

export default DefaultPageLayout;
