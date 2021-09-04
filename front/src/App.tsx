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

const useStyles = makeStyles((theme) => ({
  grid: {
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
    <Grid container alignItems="flex-start" className={styles.grid}>
      <Header />
      <Router>
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
      </Router>
    </Grid>
  );
}

export default App;
