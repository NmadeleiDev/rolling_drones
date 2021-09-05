import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useState } from "react";
import { api } from "../../axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    fontSize: "0.7rem",
    margin: 10,
  },
  cell: {
    textAlign: "center",
    width: 150,
    padding: 0,
    borderBottom: "none",
  },
  row: {
    position: "relative",
    borderBottom: "1px solid #ffffff44",
  },
});

interface IInputs {
  file_forecast: string | Blob;
  file_fact: string | Blob;
}

export interface IRow {
  year: string;
  forecast: boolean;
  fact: boolean;
}

export interface IRowProps {
  row: IRow;
  updateRows: (row: IRow) => void;
}

function Row({ row, updateRows }: IRowProps) {
  const styles = useStyles();
  const [inputs, setInputs] = useState<IInputs>({
    file_forecast: "",
    file_fact: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const uploadForecastHandler = (e: any) => {
    if (!e.target) return;
    const target = e.currentTarget;
    console.dir(target.control.files);
    if (!target.control.files || target.control.files.length === 0) return;

    // ожидаем имя файла с прогнозами на следующие 3 года
    // например, для 2010 года ждем файл "прогноз 2011-2013"
    if (!target.control.files[0].name.match(+row.year + 1))
      return enqueueSnackbar(
        "Неправильное имя файла: " + target.control.files[0].name,
        {
          variant: "error",
        }
      );

    setInputs((prevState) => ({
      ...prevState,
      file_forecast: target.control.files[0],
    }));

    uploadFiles(target.control.files[0], "file_forecast");
  };

  const uploadFactHandler = (event: any) => {
    if (!event.target) return;
    const target = event.currentTarget;
    console.dir(target.control.files);
    if (!target.control.files || target.control.files.length === 0) return;

    // ожидаем имя файла с бюджетом на этот год
    // например, для 2010 года ждем файл "бюджет 2010"
    // также исключим файлы с прогнозами (через дефис)
    if (
      !target.control.files[0].name.match(row.year) &&
      target.control.files[0].name.match(/\d+\-\d+/)
    ) {
      return enqueueSnackbar(
        "Неправильное имя файла: " + target.control.files[0].name,
        {
          variant: "error",
        }
      );
    }
    setInputs((prevState) => ({
      ...prevState,
      file_fact: target.control.files[0],
    }));

    uploadFiles(target.control.files[0], "file_fact");
  };

  const uploadFiles = async (
    file: string | Blob,
    name: "file_fact" | "file_forecast"
  ) => {
    console.log(file, name);
    if (typeof file === "string") return;

    const formData = new FormData();
    formData.append("year", `${row.year}`);
    formData.append(name, file);

    try {
      const res = await api.post("/dataloader/data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      if (res.data.error) throw new Error(res.data.data);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Не удалось загрузить файл", { variant: "error" });
      return false;
    } finally {
      inputs[name] = "";
      updateRows({ ...row, [name.split("_")[1]]: true });
    }
  };

  return (
    <TableRow key={row.year}>
      <TableCell className={styles.cell}>{row.year}</TableCell>
      <TableCell className={styles.cell}>
        <Button
          className={styles.button}
          component="label"
          color={row.forecast ? "primary" : "secondary"}
          onChange={uploadForecastHandler}
          endIcon={row.forecast ? <CheckIcon /> : <ErrorOutlineIcon />}
        >
          {row.forecast ? "Обновить" : "Загрузить"}
          <input type="file" style={{ display: "none" }} />
        </Button>
      </TableCell>
      <TableCell className={styles.cell}>
        <Button
          className={styles.button}
          component="label"
          color={row.fact ? "primary" : "secondary"}
          onChange={uploadFactHandler}
          endIcon={row.fact ? <CheckIcon /> : <ErrorOutlineIcon />}
        >
          {row.fact ? "Обновить" : "Загрузить"}
          <input type="file" style={{ display: "none" }} />
        </Button>
      </TableCell>
      <TableCell className={styles.cell}>
        <Button
          className={styles.button}
          onClick={() => history.push(`/report?year=${row.year}`)}
          disabled={!row.forecast || !row.fact}
        >
          Получить прогноз
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default Row;
