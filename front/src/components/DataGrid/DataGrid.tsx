import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { backgroundColor } from "../../theme";
import cn from "classnames";
import React, { useEffect } from "react";
import { api } from "../../axios";
import Row, { IRow } from "./Row";
import { useState } from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    paddingTop: 30,
    marginBottom: 30,
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
  hover: {
    position: "relative",
    paddingBottom: 6,
    "& .p": {
      display: "none",
      width: 400,
      fontSize: "0.7rem",
      position: "absolute",
      top: 0,
      left: 0,
      border: "1px solid #fff",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: backgroundColor.bgLight,
      padding: 5,
      zIndex: 4,
      transition: "0.3s",
    },
    "&:hover .p": {
      display: "block",
    },
  },
  listItem: {
    color: "#000",
  },
  dialog: {
    padding: 30,
  },
  select: {
    margin: 10,
    padding: 3,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    color: "#000",
  },
  formControl: {
    padding: 30,
    minWidth: 300,
  },
}));

export interface SimpleDialogProps {
  open: boolean;
  rows: IRow[];
  onClose: (value: IRow | null) => void;
}
function SimpleDialog(props: SimpleDialogProps) {
  const styles = useStyles();
  const { onClose, rows, open } = props;
  const [year, setYear] = useState("");

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.dir(event);
    if (year === "") return onClose(null);
    const row: IRow = { year, forecast: false, fact: false };
    onClose(row);
    setYear("");
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.dir(event.currentTarget);
    const value = (event.currentTarget as any).textContent as string;
    if (!value) return onClose(null);
    setYear(value);
  };

  return (
    <Dialog
      className={styles.dialog}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <FormControl className={styles.formControl}>
        <Select
          value={year}
          onChange={handleChange}
          displayEmpty
          className={styles.selectEmpty}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem style={{ color: "black" }} value="" disabled>
            Выберите год
          </MenuItem>
          {new Array(30)
            .fill(0)
            .map((_, i) => i + 2010)
            .filter((el) => !rows.find((row) => +row.year === +el))
            .map((el) => (
              <MenuItem value={`${el}`} className={styles.listItem} key={el}>
                {`${el}`}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* <select value={year} onChange={handleChange} className={styles.select}>
        {new Array(30)
          .fill(0)
          .map((_, i) => i + 2010)
          .filter((el) => !rows.find((row) => +row.year === +el))
          .map((el) => (
            <option className={styles.listItem} key={el}>
              {`${el}`}
            </option>
          ))}
      </select> */}
      <Button className={styles.button} onClick={handleClose}>
        Выбрать
      </Button>
    </Dialog>
  );
}

function DataGrid() {
  const styles = useStyles();
  const [rows, setRows] = useState<IRow[]>([]);
  const [open, setOpen] = useState(false);

  const addRow = (value: IRow) => {
    const index = rows.findIndex((row) => +row.year === +value.year);
    console.log(index);
    if (index >= 0) {
      setRows(
        rows
          .slice(0, index)
          .concat([value])
          .concat(rows.slice(index + 1))
      );
    } else {
      setRows([...rows, value].sort((a, b) => +a.year - +b.year));
    }
  };

  const openModalHandler = () => {
    !open && setOpen(true);
  };
  const handleClose = (value: IRow | null) => {
    setOpen(false);
    if (!value) return;
    addRow(value);
  };

  const getTables = async () => {
    try {
      const res = await api("/dataloader/data");
      console.log(res.data);
      if (res.data.error) console.error(res.data);
      else setRows((res.data.data as IRow[]).sort((a, b) => +a.year - +b.year));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("[Upload] useEffect");
    getTables();
  }, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <TableContainer component="div">
        <Table className={styles.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow className={styles.row}>
              <TableCell className={cn(styles.hover, styles.cell)}>
                Бюджетный год<sup>*</sup>
                <p className="p">
                  Год, после которого будет рассчитываться прогноз бюджета.
                  <br />
                  Для этого года нужны данные СЭР и бюджета.
                </p>
              </TableCell>
              <TableCell className={styles.cell}>Прогноз СЭР</TableCell>
              <TableCell className={styles.cell}>Бюджет</TableCell>
              <TableCell className={styles.cell}>Прогноз бюджета</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row row={row} updateRows={addRow} key={row.year} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="text" onClick={openModalHandler}>
        Добавить год
      </Button>
      <SimpleDialog rows={rows} open={open} onClose={handleClose} />
    </Grid>
  );
}

export default DataGrid;
