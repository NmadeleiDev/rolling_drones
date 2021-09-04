import { makeStyles } from "@material-ui/core";
import Chart from "../Chart/Chart";
import Page from "../Page/Page";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function Report() {
  const styles = useStyles();
  return (
    <Page>
      <>
        <Chart />
      </>
    </Page>
  );
}

export default Report;
