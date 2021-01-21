use crate::{message::message::MessageContents, Result};
use iota_streams::{
    app_channels::api::tangle::Author,
    app::transport::{
        TransportOptions,
        tangle::{
            PAYLOAD_BYTES,
            TangleAddress as Address,
            client::{Client as StreamsClient,}
        }
    },
    core::prelude::{Vec, String},
    ddml::types::Bytes,
};

use std::sync::Arc;
use tokio::{sync::Mutex, time::Duration};
use anyhow::anyhow;
use crate::config::ClientConfig;
use iota_streams::app::transport::tangle::client::SendTrytesOptions;
use serde::Deserialize;

pub struct Client {
    pub id: Vec<u8>,
    pub ann_link: Address,
    client: Arc<Mutex<Author<StreamsClient>>>,
    send_pool: Vec<MessageContents>,
    last_link: Option<Address>,
}

#[derive(Deserialize)]
pub struct SendOptions {
    pub depth: u8,
    pub min_weight_magnitude: u8,
    pub local_pow: bool,
    pub threads: usize
}

impl Client {
    pub fn new(config: &ClientConfig) -> Result<Client> {
        let mut seed = String::from("SomeKindaSalt");
        seed.push_str(&config.node_config.id);

        let multi_branch = false;
        let send_trytes_options = SendTrytesOptions {
            depth: config.send_options.depth,
            min_weight_magnitude: config.send_options.min_weight_magnitude,
            local_pow: config.send_options.local_pow,
            threads: config.send_options.threads
        };

        let mut transport = StreamsClient::new_from_url(&config.node_config.node);
        transport.set_send_options(send_trytes_options);

        let mut client = Author::new(&seed, "utf-8", PAYLOAD_BYTES, multi_branch, transport);
        let ann_link = client.send_announce()?;

        let send_pool = Vec::<MessageContents>::new();

        Ok(Client {
            id: config.node_config.id.as_bytes().to_vec(),
            client: Arc::new(Mutex::new(client)),
            send_pool,
            last_link: Some(ann_link.clone()),
            ann_link
        })
    }

    pub fn get_ann_link(&self) -> &Address {
        &self.ann_link
    }

    pub fn get_next_message(&self) -> Option<MessageContents> {
        match self.send_pool.first() {
            Some(msg) => Some(MessageContents::new(
                msg.get_public().clone(),
                msg.get_masked().clone()
            )),
            None => None,
        }
    }

    pub fn add_message(&mut self, msg: &MessageContents) -> Result<()> {
        Ok(self.send_pool.push(
            MessageContents::new(msg.get_public().clone(), msg.get_masked().clone())
        ))
    }

    pub fn remove_message(&mut self, msg: &MessageContents) -> Result<()> {
        if let Some(index) = self.send_pool.iter().position(|m| m.eq(msg)) {
            self.send_pool.remove(index);
        }
        Ok(())
    }

    pub async fn send_message(&mut self, msg: &MessageContents) -> Result<()> {
        match &self.last_link {
            Some(link) => {
                let (new_link, seq) = self.client.lock().await.send_signed_packet(
                    &link,
                    &Bytes(msg.get_public().clone()),
                    &Bytes(msg.get_masked().clone())
                )?;

                self.remove_message(msg);
                if seq.is_none() {
                    self.last_link = Some(new_link);
                } else {
                    self.last_link = seq;
                }
                Ok(())
            },
            None => Err(anyhow!("No link present... channel may not exist"))
        }
    }

}