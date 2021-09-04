import { Grid, makeStyles } from "@material-ui/core";
import Sidebar from "./components/Sidebar/Sidebar";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Redirect,
// } from "react-router-dom";
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

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    padding: "1rem",
    background: `linear-gradient(125deg, ${backgroundColor.bgLight}, ${backgroundColor.bgDark})`,
    textAlign: "center",
    color: theme.palette.text.primary,
  },
}));

function App() {
  const styles = useStyles();
  return (
    <Grid container className={styles.root}>
      <Router>
        <Sidebar />
        <Switch>
          <Route path="/report">
            <Report />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Redirect from="/" to="/report" />
        </Switch>
      </Router>
    </Grid>
  );
}

export default App;
