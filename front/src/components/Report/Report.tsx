import { makeStyles } from "@material-ui/core";
import Chart, { ChartProps } from "../Chart/Chart";
import Page from "../Page/Page";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../axios";
import { useSnackbar } from "notistack";
import { ChartData } from "chart.js";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const formatDataset = (data: any) => {
  const labels = [];
  const formattedData = [];
  console.log(data);
  for (let year in data) {
    for (let i = 0; i < months.length; i++) {
      labels.push(`${year}-${months[i]}`);
      formattedData.push(data[year][i]);
    }
  }
  return { labels, data: formattedData };
};

const getDatasets = (data: any): ChartData => {
  console.log(Object.entries(data));

  let labels: string[] = [];

  const datasets = Object.entries(data).map((entry: any) => {
    const label = entry[0];
    const formattedData = formatDataset(entry[1]);
    labels = formattedData.labels;

    return {
      label,
      data: formattedData.data,
      cubicInterpolationMode: "monotone",
    };
  });

  console.log(datasets);

  return { labels, datasets };
};

function Report() {
  const styles = useStyles();
  const location = useLocation();
  const [data, setData] = useState<ChartData>();
  const { enqueueSnackbar } = useSnackbar();

  const year = location.search.match(/year=(\d{4})/)?.[1];
  console.log(year);

  useEffect(() => {
    const getChartData = async () => {
      try {
        const res = await api("/ml/predict", {
          params: { year },
        });
        console.log(res.data);
        const dataset = getDatasets(res.data.data);
        console.log(dataset);
        setData(dataset);
      } catch (e) {
        enqueueSnackbar("Ошибка получения предикта", { variant: "error" });
      }
    };
    getChartData();
  }, []);

  return (
    <Page>
      <Chart title="Income" year={year} data={data} />
    </Page>
  );
}

export default Report;
