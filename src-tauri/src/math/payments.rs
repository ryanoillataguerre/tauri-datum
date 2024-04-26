use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct PeriodRow {
    period: i32,
    begin_bal: f64,
    interest: f64,
    principal: f64,
    end_bal: f64,
}

pub fn calc_periods(years: i32, rate: f64, monthly_payment: f64, begin_bal: f64) -> Vec<PeriodRow> {
    let mut period_rows: Vec<PeriodRow> = Vec::new();
    let num_months = years * 12;
    let mut period = 1;
    let mut begin_bal = begin_bal;
    let mut end_bal = begin_bal;
    while end_bal >= 0.0 {
        let interest = begin_bal * rate / 12.0;
        let principal = monthly_payment - interest;
        end_bal = begin_bal - principal;
        period_rows.push(PeriodRow {
            period,
            begin_bal,
            interest,
            principal,
            end_bal,
        });
        begin_bal = end_bal;
        period += 1;
    }
    period_rows
}
