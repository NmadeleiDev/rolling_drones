import { makeStyles } from "@material-ui/core";
import Page from "../Page/Page";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function Upload() {
  const styles = useStyles();
  return (
    <Page>
      <div>upload</div>
    </Page>
  );
}

export default Upload;
