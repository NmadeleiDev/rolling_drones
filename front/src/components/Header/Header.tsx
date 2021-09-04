import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: 60,
    padding: "1rem",
  },
}));

function Header() {
  const styles = useStyles();
  return (
    <Grid container justifyContent="space-around" className={styles.root}>
      <div>Logo</div>
      <div>profile</div>
    </Grid>
  );
}

export default Header;
