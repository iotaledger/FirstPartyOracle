use iota_streams::core::prelude::hash_map::{HashMap, IterMut};
use crate::{client::Client, Result};
use anyhow::anyhow;

pub struct ClientStore {
    clients: HashMap<Vec<u8>, Client>
}

impl ClientStore {
    pub fn init() -> ClientStore {
        ClientStore { clients: HashMap::<Vec<u8>, Client>::new() }
    }

    pub fn iter(&mut self) -> IterMut<Vec<u8>, Client> { self.clients.iter_mut() }

    pub fn get_client(&mut self, id: &[u8]) -> Option<&mut Client> {
        self.clients.get_mut(id)
    }

    pub fn add_client(&mut self, id: Vec<u8>, client: Client) -> Result<()> {
        match self.clients.contains_key(&id) {
            true => Err(anyhow!("Client with id {:?} already exists", id)),
            false => {
                self.clients.insert(id, client);
                Ok(())
            }
        }
    }
}
