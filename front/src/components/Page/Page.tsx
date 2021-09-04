import { Container, makeStyles } from "@material-ui/core";

export interface PageProps {
  children: JSX.Element;
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100vw",
    padding: "0 0 0 200px",
  },
}));

function Page({ children }: PageProps) {
  const styles = useStyles();
  return <Container className={styles.container}>{children}</Container>;
}

export default Page;
