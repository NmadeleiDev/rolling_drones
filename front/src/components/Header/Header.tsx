import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: 60,
    padding: "1rem",
  },
  img: {
    height: "100%",
    marginRight: 10,
  },
  logo: {
    height: "100%",
    width: 200,
    alignItems: "center",
  },
}));

function Header() {
  const styles = useStyles();
  return (
    <Grid container justifyContent="space-between" className={styles.root}>
      <Grid container className={styles.logo}>
        <img
          className={styles.img}
          src={process.env.PUBLIC_URL + "logo512.png"}
          alt="logo"
        />
        Rolling Drones
      </Grid>
    </Grid>
  );
}

export default Header;
