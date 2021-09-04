import { Grid, makeStyles } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    left: 0,
    top: 60,
    minHeight: "100vh",
    width: 165,
    padding: "1rem",
    paddingTop: "0.5rem",
  },
  link: {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    fontWeight: 700,
    textTransform: "uppercase",
    textAlign: "start",
    cursor: "pointer",
    margin: "1rem",
    "&:hover": {
      color: theme.palette.text.primary,
      textShadow: "0 0 3px #fff",
    },
  },
  active: {
    color: theme.palette.text.primary,
    textShadow: "0 0 3px #fff",
  },
}));

const pages = [
  {
    to: "upload",
    name: "загрузить данные",
  },
  {
    to: "report",
    name: "отчёт",
  },
  {
    to: "settings",
    name: "настройки",
  },
];

function Sidebar() {
  const styles = useStyles();
  const location = useLocation();
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      className={styles.root}
    >
      {pages.map((page) => (
        <Link
          className={
            location.pathname.match(page.to)
              ? cn(styles.link, styles.active)
              : styles.link
          }
          key={page.name}
          to={page.to}
        >
          {page.name}
        </Link>
      ))}
    </Grid>
  );
}

export default Sidebar;
