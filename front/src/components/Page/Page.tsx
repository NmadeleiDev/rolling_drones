import { Container, makeStyles } from "@material-ui/core";

export interface PageProps {
  children: JSX.Element;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    padding: "200px 0 0 0",
  },
}));

function Page({ children }: PageProps) {
  const styles = useStyles();
  console.log("[Page] render");
  return <Container className={styles.root}>{children}</Container>;
}

export default Page;
