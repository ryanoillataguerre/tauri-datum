pub fn pmt(rate: f64, nper: f64, pv: f64, fv: f64) -> Result<f64, tauri::Error> {
    let is_rate_zero = rate == 0.0;
    let temp = (1.0 + rate).powf(nper);
    let masked_rate = if is_rate_zero { 1.0 } else { rate };
    let fact = if is_rate_zero {
        nper
    } else {
        ((1.0 + masked_rate) * (temp - 1.0)) / masked_rate
    };
    let pmt = -1.0 * (fv + pv * temp) / fact;
    // Round to nearest 2nd decimal
    Ok((pmt * 100.0).round() / 100.0)
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_pmt() {
        assert_eq!(pmt(0.0, 0.0, 0.0, 0.0).unwrap(), 0.0);
        assert_eq!(pmt(0.06 / 12, 30 * 12, 100000, 0).unwrap(), -596.57);
    }
}
