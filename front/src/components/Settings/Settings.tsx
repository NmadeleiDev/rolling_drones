import { makeStyles } from "@material-ui/core";
import Page from "../Page/Page";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function Settings() {
  const styles = useStyles();
  return (
    <Page>
      <div>Settings</div>
    </Page>
  );
}

export default Settings;
