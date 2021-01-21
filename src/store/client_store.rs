use iota_streams::{
    core::prelude::{
        hash_map::{HashMap, IterMut},
        String
    }
};
use crate::{client::Client, Result};

pub struct ClientStore {
    clients: HashMap<Vec<u8>, Client>
}
use anyhow::anyhow;

impl ClientStore {
    pub fn init() -> ClientStore {
        ClientStore { clients: HashMap::<Vec<u8>, Client>::new() }
    }

    pub fn iter(&mut self) -> IterMut<Vec<u8>, Client> { self.clients.iter_mut() }

    pub fn get_client(&mut self, id: &[u8]) -> Option<&mut Client> {
        self.clients.get_mut(id)
    }

    pub fn add_client(&mut self, id: Vec<u8>, client: Client) -> Result<()> {
        self.clients.insert(id, client).ok_or_else(|| anyhow!("Client could not be added"));
        Ok(())
    }

}
