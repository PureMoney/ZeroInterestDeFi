const FACTOR: f64 = 10_000.0;

pub fn decimal_to_u8(number: f64) -> u64 {
    let number = number * FACTOR;
    number as u64
}
