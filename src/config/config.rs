use serde::Deserialize;
use crate::http::Request;
use crate::client::SendOptions;

#[derive(Deserialize)]
pub struct ClientConfig {
    pub node_config: NodeConfig,
    pub send_options: SendOptions,
    pub req_input: Option<ReqInput>,
}

#[derive(Deserialize)]
pub struct RetrieverConfig {
    pub id: String,
    pub node: String,
    pub address: String,
}

#[derive(Deserialize)]
pub struct NodeConfig {
    pub id: String,
    pub node: String,
    pub whitelist: Vec<String>
}

#[derive(Deserialize)]
pub struct ReqInput {
    pub ticker: u64, // Milliseconds
    pub request: Request,
}


impl ClientConfig {
    pub fn get_request_input(&self) -> Option<ReqInput> {
        match &self.req_input {
            Some(req) => {
                Some(ReqInput::from(req ))
            },
            None => None
        }
    }
}

impl ReqInput {
    pub fn from(&self) -> ReqInput {
        ReqInput { ticker: self.ticker, request: self.request.clone() }
    }
}
