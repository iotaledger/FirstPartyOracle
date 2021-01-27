pub mod client;
pub mod retriever;

pub use client::*;
pub use retriever::*;
use rand::Rng;
pub static ALPH9: &str = "abcdefghijklmnopqrstuvwxyz1234567890";

pub fn get_salt(size: u8) -> String {
    (0..size).map(|_| ALPH9.chars()
        .nth(
            rand::thread_rng()
                .gen_range(0, ALPH9.len())
        ).unwrap()
    ).collect::<String>()
}
