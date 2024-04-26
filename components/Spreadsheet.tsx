"use client";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { ColDef, ColGroupDef } from "ag-grid-community";
interface PaymentRow {
  period: number;
  begin_bal: number;
  interest: number;
  principal: number;
  end_bal: number;
}

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

  const getPayments = async ({
    rate,
    nper,
    monthlyPayment,
    beginBalance,
  }: {
    rate: number;
    nper: number;
    monthlyPayment: number;
    beginBalance: number;
  }): Promise<PaymentRow[]> => {
    return new Promise<PaymentRow[]>((resolve, reject) => {
      invoke<PaymentRow[]>("payments__calculation", {
        rate,
        nper,
        monthly_payment: monthlyPayment,
        begin_balance: beginBalance,
      })
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
      // Set payments in all rows past monthly payment row
      const monthlyPayment = parseFloat(rowData[3].value);
      let beginBalance = parseFloat(loan);
      getPayments({
        rate: parseFloat(interestRate) / 100 / 12,
        nper: parseFloat(term) * 12,
        monthlyPayment,
        beginBalance,
      }).then((result) => {
        console.log(result);
        // Set payment rows in the grid
        for (let i = 0; i < result.length; i++) {
          rowData[i + 5] = {
            period: result[i].period,
            begin_bal: result[i].begin_bal,
            interest: result[i].interest,
            principal: result[i].principal,
            end_bal: result[i].end_bal,
          };
        }
      });
      setRowData(() => [...rowData]);
    }
  };
  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: rowData.length * 50, width: 600 }} // the grid will fill the size of the parent container
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
