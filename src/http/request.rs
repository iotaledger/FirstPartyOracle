use anyhow::Result;
use serde::Deserialize;
use ureq::SerdeValue;

#[derive(Deserialize)]
pub struct Request {
    pub url: String,
    header: SerdeValue,
    body: SerdeValue,
}

impl Request {
    pub fn new(url: String, header: SerdeValue, body: SerdeValue) -> Request {
        Request { url, header, body }
    }

    pub fn get(&self) -> Result<ureq::Response> {
        let mut req = ureq::get(&self.url);
        if let Some(header) = self.header.as_object() {
            for (k, v ) in header {
                req = req.set(k, v.as_str().unwrap());
            }
        }
        let resp = req.call()?;
        Ok(resp)
    }

    pub fn clone(&self) -> Request {
        Request::new(self.url.clone(), self.header.clone(), self.body.clone())
    }
}
