use iota_streams::{
    core::prelude::{HashMap, String}
};
use crate::{client::Retriever, Result};

pub struct RetrieverStore {
    retriever: HashMap<Vec<u8>, Retriever>
}
use anyhow::anyhow;

impl RetrieverStore {
    pub fn init() -> RetrieverStore {
        RetrieverStore { retriever: HashMap::<Vec<u8>, Retriever>::new() }
    }

    pub fn get_retriever(&mut self, id: &[u8]) -> Option<&mut Retriever> {
        self.retriever.get_mut(id)
    }

    pub fn add_retriever(&mut self, id: Vec<u8>, retriever: Retriever) -> Result<()> {
        self.retriever.insert(id, retriever).ok_or_else(|| anyhow!("Client could not be added"));
        Ok(())
    }

}