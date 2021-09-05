import { makeStyles } from "@material-ui/core";
import { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
// import { primaryColor, secondaryColor } from "../../theme";

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    border: "1px solid #ffffff0f",
    borderRadius: 15,
    // box-shadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    position: "relative",
    fontSize: "2rem",
    padding: 30,
    margin: 30,
    width: 700,
    height: 400,
    backdropFilter: "blur(10px) saturate(120%)",
  },
  header: {
    fontSize: "1rem",
  },
}));

export interface ChartProps {
  data?: any;
  year?: string;
  title?: string;
}

const colors = {
  green: "#DAF7A6",
  orange: "#FFC300",
  red: "#FF5733",
  brown: "#C70039",
};

const mockData: ChartData = {
  labels: [1, 2, 3, 4],
  datasets: [
    {
      label: "Income",
      backgroundColor: colors.orange,
      borderColor: colors.orange,
      data: [2, 8, 5, 4],
      cubicInterpolationMode: "monotone",
    },
    {
      label: "Revenue",
      backgroundColor: colors.green,
      borderColor: colors.green,
      data: [4, 7, 2, 3],
      cubicInterpolationMode: "monotone",
    },
  ],
};

function Chart(props: ChartProps) {
  const styles = useStyles();
  console.log("[Chart] props:", props);

  const setGradientColor = (canvas: HTMLCanvasElement, color: string) => {
    const gradient = canvas
      .getContext("2d")
      ?.createLinearGradient(0, 0, 400, 0);
    gradient?.addColorStop(0, color);
    gradient?.addColorStop(1, "#ffffff");
    return gradient;
  };
  const getChartData = (canvas: HTMLCanvasElement) => {
    const data = props.data || mockData;
    console.log("[getChartData] data:", data);
    if (data.datasets) {
      data.datasets.forEach((set: any, i: number) => {
        set.backgroundColor = setGradientColor(
          canvas,
          colors[i == 0 ? "green" : "orange"]
        );
        set.borderColor = colors[i == 0 ? "green" : "orange"];
        set.borderWidth = 2;
      });
    }
    return data;
  };
  return (
    <div className={styles.root}>
      <h2 className={styles.header}>
        {props.title}
        {props.year && ` for ${props.year}`}
      </h2>
      <div className={styles.card}>
        <Line
          options={{
            responsive: true,
          }}
          data={getChartData}
          className="canvas"
        />
      </div>
    </div>
  );
}

export default Chart;
