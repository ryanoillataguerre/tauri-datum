"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
  CellEditingStoppedEvent,
  ColDef,
  ColGroupDef,
} from "ag-grid-community";

const Spreadsheet = () => {
  const getPmt = async ({
    rate,
    nper,
    pv,
    fv,
  }: {
    rate: number;
    nper: number;
    pv: number;
    fv: number;
  }) => {
    return new Promise<number>((resolve, reject) => {
      invoke<number>("pmt_calculation", { rate, nper, pv, fv })
        .then((result) => resolve(result))
        .catch(reject);
    });
  };
  const [rowData, setRowData] = useState([
    { label: "Loan", value: "1000000" },
    { label: "Interest Rate (Annual)", value: "6.0" },
    { label: "Term (Yrs)", value: "30" },
    { label: "Monthly Payment", value: "-5995.51" },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<
    (
      | ColDef<{ label: string; value: string }, any>
      | ColGroupDef<{ label: string; value: string }>
    )[]
  >([
    { headerName: "Label", field: "label" },
    {
      headerName: "Value",
      field: "value",
      editable: true,
    },
  ]);

  const onCellEdit = () => {
    const loan = rowData.find((row) => row.label === "Loan")?.value;
    const interestRate = rowData.find(
      (row) => row.label === "Interest Rate (Annual)"
    )?.value;
    const term = rowData.find((row) => row.label === "Term (Yrs)")?.value;
    // Get PMT based on the new value
    if (loan && interestRate && term) {
      getPmt({
        rate: parseFloat(interestRate) / 100 / 12,
        nper: parseFloat(term) * 12,
        pv: -parseFloat(loan),
        fv: 0,
      }).then((result) => {
        rowData[3].value = (-result).toString();
        setRowData(() => [...rowData]);
      });
    }
  };
  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 300, width: 450 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellEditingStopped={onCellEdit}
      />
    </div>
  );
};

export default Spreadsheet;
