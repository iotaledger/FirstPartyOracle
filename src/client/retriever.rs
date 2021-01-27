use iota_streams::{
    app_channels::api::tangle::{Subscriber, Address, MessageContent},
    app::transport::tangle::{PAYLOAD_BYTES, client::Client as StreamsClient},
};

use tokio::sync::Mutex;
use std::sync::Arc;
use crate::{
    message::message::{MessageContents, RetrievedMessage},
    config::RetrieverConfig,
    client::get_salt
};
use anyhow::Result;
use iota_client::bytes_to_trytes;


pub struct Retriever {
    pub id: Vec<u8>,
    pub channel: Address,
    client: Arc<Mutex<Subscriber<StreamsClient>>>
}

impl Retriever {
    pub fn new(config: &RetrieverConfig) -> Result<Retriever> {
        let mut seed = get_salt(32);
        seed.push_str(&config.id);

        let transport = StreamsClient::new_from_url(&config.node);
        let mut client = Subscriber::new(&seed, "utf-8", PAYLOAD_BYTES, transport);

        let mut address = config.address.clone();
        address = address.strip_prefix("<").unwrap_or(&address).to_string();
        address = address.strip_suffix(">").unwrap_or(&address).to_string();
        let link_vec: Vec<&str> = address.split(":").collect();

        let channel = Address::from_str(link_vec[0], link_vec[1]).unwrap();
        client.receive_announcement(&channel)?;

        Ok(Retriever { id: config.id.as_bytes().to_vec(), channel, client: Arc::new(Mutex::new(client))})
    }

    pub async fn fetch_msgs(&mut self) -> Result<Vec<RetrievedMessage>> {
        let mut messages = Vec::new();

        for msg in self.client.lock().await.fetch_next_msgs() {
            match msg.body {
                MessageContent::SignedPacket {
                    pk,
                    public_payload: p,
                    masked_payload: m
                } => {
                    messages.push(RetrievedMessage::new(
                        bytes_to_trytes(msg.link.msgid.as_ref()).to_string(),
                        pk,
                        MessageContents::new(p.0, m.0)
                    ))
                },
                _ => {}
            }
        }
        Ok(messages)
    }
}
