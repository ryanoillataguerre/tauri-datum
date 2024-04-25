// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::math::pmt::pmt;

#[tauri::command]
fn pmt_calculation(rate: f64, nper: f64, pv: f64, fv: f64) -> Result<f64, tauri::Error> {
    match pmt(rate, nper, pv, fv) {
        Ok(pmt) => Ok(pmt),
        Err(e) => Err(tauri::Error::from(e)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![pmt_calculation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
