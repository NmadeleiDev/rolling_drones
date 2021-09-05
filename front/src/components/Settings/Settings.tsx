import { makeStyles } from "@material-ui/core";
import DataGrid from "../DataGrid/DataGrid";
import Page from "../Page/Page";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function Settings() {
  const styles = useStyles();
  return (
    <Page>
      <DataGrid />
    </Page>
  );
}

export default Settings;
