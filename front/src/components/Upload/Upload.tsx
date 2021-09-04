import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { api } from "../../axios";
import Page from "../Page/Page";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  buttons: {
    width: "60%",
  },
  button: {
    margin: 10,
    width: "100%",
  },
}));

interface IInputs {
  file_forecast: string | Blob;
  file_fact: string | Blob;
  tableName: string;
}

function Upload() {
  const styles = useStyles();

  const [inputs, setInputs] = useState<IInputs>({
    file_forecast: "",
    file_fact: "",
    tableName: "",
  });

  const textInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget) return;

    setInputs({ ...inputs, tableName: e.currentTarget.value });
  };

  const uploadForecastHandler = (e: any) => {
    if (!e.target) return;
    const target = e.currentTarget;
    console.dir(target.control.files);
    if (!target.control.files || target.control.files.length === 0) return;

    setInputs({ ...inputs, file_forecast: target.control.files[0] });
  };

  const uploadFactHandler = (event: any) => {
    if (!event.target) return;
    const target = event.currentTarget;
    console.dir(target.control.files);
    if (!target.control.files || target.control.files.length === 0) return;

    setInputs({ ...inputs, file_fact: target.control.files[0] });
  };

  const uploadFiles = async (e: any) => {
    if (inputs.file_fact === "" || inputs.file_forecast === "") return;

    const formData = new FormData();
    formData.append("name", inputs.tableName);
    formData.append("file_forecast", inputs.file_forecast);
    formData.append("file_fact", inputs.file_fact);

    console.log(formData);
    try {
      const res = await api.post("/dataloader/data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    } finally {
      inputs.file_fact = "";
      inputs.file_forecast = "";
    }
  };

  const getTables = async () => {
    try {
      const res = await api("/dataloader/data");
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("[Upload] useEffect");
    getTables();
  }, []);

  return (
    <Page>
      <Grid container justifyContent="center" className={styles.root}>
        <Button
          className={styles.button}
          onClick={getTables}
          variant="contained"
        >
          Получить таблицы
        </Button>
        <p>
          Для получения прогноза необходимо загрузить файл прогноза
          экономического развития и файл с результатами использования бюджета за
          прошлый год. Также надо выбрать, в какую таблицу загружать данные.
        </p>
        <TextField value={inputs.tableName} onChange={textInputHandler} />
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          className={styles.buttons}
        >
          <Button
            className={styles.button}
            component="label"
            onChange={uploadForecastHandler}
            endIcon={
              inputs.file_forecast === "" ? <ErrorOutlineIcon /> : <CheckIcon />
            }
          >
            Прикрепить прогноз экономического развития
            <input type="file" style={{ display: "none" }} />
          </Button>
          <Button
            className={styles.button}
            component="label"
            onChange={uploadFactHandler}
            endIcon={
              inputs.file_fact === "" ? <ErrorOutlineIcon /> : <CheckIcon />
            }
          >
            Прикрепить расход бюджета
            <input type="file" style={{ display: "none" }} />
          </Button>
          <Button
            className={styles.button}
            onClick={uploadFiles}
            variant="contained"
            color="secondary"
          >
            Загрузить
          </Button>
        </Grid>
      </Grid>
    </Page>
  );
}

export default Upload;
