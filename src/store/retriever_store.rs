use iota_streams::core::prelude::HashMap;
use crate::{client::Retriever, Result};
use anyhow::anyhow;

pub struct RetrieverStore {
    retriever: HashMap<Vec<u8>, Retriever>
}

impl RetrieverStore {
    pub fn init() -> RetrieverStore {
        RetrieverStore { retriever: HashMap::<Vec<u8>, Retriever>::new() }
    }

    pub fn get_retriever(&mut self, id: &[u8]) -> Option<&mut Retriever> {
        self.retriever.get_mut(id)
    }

    pub fn add_retriever(&mut self, id: Vec<u8>, retriever: Retriever) -> Result<()> {
        match self.retriever.contains_key(&id) {
            true => Err(anyhow!("Retriever with id {:?} already exists", id)),
            false => {
                self.retriever.insert(id, retriever);
                Ok(())
            }
        }
    }

}
