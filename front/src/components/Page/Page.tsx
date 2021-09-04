import { Container, makeStyles } from "@material-ui/core";

export interface PageProps {
  children: JSX.Element | JSX.Element[];
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 50px 0 120px",
  },
}));

function Page({ children }: PageProps) {
  const styles = useStyles();
  return <Container className={styles.container}>{children}</Container>;
}

export default Page;
