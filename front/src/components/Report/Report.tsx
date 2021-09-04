import { makeStyles } from "@material-ui/core";
import Page from "../Page/Page";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function Report() {
  const styles = useStyles();
  return (
    <Page>
      <div>Report</div>
    </Page>
  );
}

export default Report;
