"use client";
import { useEffect, useState } from "react";
import * as SprdPackage from "react-spreadsheet";
import { invoke } from "@tauri-apps/api/tauri";

const DefaultSpreadsheet = SprdPackage.Spreadsheet;

const Spreadsheet = () => {
  const [data, setData] = useState([
    [{ value: "Vanilla" }, { value: "Chocolate" }, { value: "" }],
    [{ value: "Strawberry" }, { value: "Cookies" }, { value: "" }],
  ]);
  // const onSubmitValues = () => {
  //   invoke<number>("pmt_calculation", { rate: 0.05, nper: 5, pv: 1000, fv: 0 })
  //     .then((result) => console.log(result))
  //     .catch(console.error);
  // };
  const onChange = (data: SprdPackage.Matrix<{ value: string }>) => {
    console.log(data);
  };
  return <DefaultSpreadsheet data={data} onChange={onChange} />;
};

export default Spreadsheet;
