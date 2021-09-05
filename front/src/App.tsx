import { Grid, makeStyles } from "@material-ui/core";
import Sidebar from "./components/Sidebar/Sidebar";
import { backgroundColor } from "./theme";
import Report from "./components/Report/Report";
import Upload from "./components/Upload/Upload";
import Settings from "./components/Settings/Settings";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/Header/Header";
import { SnackbarProvider } from "notistack";

const useStyles = makeStyles((theme) => ({
  grid: {
    position: "relative",
    minWidth: 900,
    height: "100vh",
    padding: "1rem",
    background: `linear-gradient(125deg, ${backgroundColor.bgLight}, ${backgroundColor.bgDark})`,
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  root: {
    maxWidth: "100%",
    minWidth: 500,
    margin: 0,
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
}));

function App() {
  const styles = useStyles();
  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={styles.grid}
    >
      <Header />
      <Router>
        <SnackbarProvider maxSnack={3} classes={{ containerRoot: styles.root }}>
          <Sidebar />
          <Switch>
            <Route path="/upload">
              <Upload />
            </Route>
            <Route path="/report">
              <Report />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Redirect from="/" to="/upload" />
          </Switch>
        </SnackbarProvider>
      </Router>
    </Grid>
  );
}

export default App;
