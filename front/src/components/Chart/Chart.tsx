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
    width: 500,
    height: 300,
    backdropFilter: "blur(10px) saturate(120%)",
  },
}));

export interface ChartProps {
  data?: ChartData;
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
  // const setGradientColor = (canvas: HTMLCanvasElement, color: string) => {
  //   const gradient = canvas
  //     .getContext("2d")
  //     ?.createLinearGradient(0, 0, 700, 400);
  //   if (!gradient) return;
  //   gradient.addColorStop(0, color);
  //   gradient.addColorStop(1, "white");
  //   return gradient;
  // };

  const getChartData = (canvas: HTMLCanvasElement) => {
    const data = props.data || mockData;
    // if (data.datasets) {
    // let colors = [primaryColor.main, secondaryColor.main];
    // data.datasets.forEach((set, i) => {
    //   // set.backgroundColor = setGradientColor(canvas, colors[i]);
    //   // set.borderColor = colors[i];
    //   set.borderWidth = 2;
    // });
    // }
    return data;
  };
  return (
    <div className={styles.root}>
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
