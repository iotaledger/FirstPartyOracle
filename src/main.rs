use Oracle::store::ClientStore;
use Oracle::store::RetrieverStore;
use Oracle::message::message::{MessageContents, RetrievedMessage};
use Oracle::client::{Client, Retriever};
use Oracle::Result;
use anyhow::anyhow;
use Oracle::threads::{Executor, Job};
use iota_streams::app_channels::api::tangle::Address;

use ureq::json;
use tokio::sync::Mutex;
use std::sync::Arc;
use Oracle::config::{ClientConfig, RetrieverConfig, NodeConfig, ReqInput};
use rand::Rng;
use iota_streams::app::transport::tangle::client::SendTrytesOptions;
use Oracle::http::Request;
use std::fs::File;
use std::iter::Map;
use std::borrow::Borrow;

/*
pub struct Oracle {
    clients: Arc<Mutex<ClientStore>>,
    executor: Executor
}*/

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let mut client_store = Arc::new(Mutex::new(ClientStore::init()));
    let mut retriever_store = Arc::new(Mutex::new(RetrieverStore::init()));
    let executor = Executor::init(client_store.clone());

/*    let alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";

    let id: &str = &(0..10).map(|_| alphabet.chars().nth(rand::thread_rng().gen_range(0,alphabet.len())).unwrap()).collect::<String>();
    let id2: &str = &(0..10).map(|_| alphabet.chars().nth(rand::thread_rng().gen_range(0,alphabet.len())).unwrap()).collect::<String>();
    let node = "http://192.168.1.68:14265";

    let node_config = NodeConfig { id: id.to_string(), node: node.to_string() };
    let send_options = SendTrytesOptions { depth: 1, min_weight_magnitude: 9, local_pow: true, threads: 2 };
    let request =  Request::new( "https://us.market-api.kaiko.io/v2/data/trades.v1/exchanges/bfnx/spot/btc-usd/trades".to_string(), json!({"Accept": "application/json","X-Api-Key": "0729dc53f1dee66c624fc15dccd8e55c"}), json!({}));
    let client_config = ClientConfig { node_config, send_options, request: Some(ReqInput { ticker: 5000, request })};
*/
    let mut args: Vec<String> = std::env::args().collect();
    let mut config_file = "ClientConfigs.json".to_string();
    for arg in 0..args.len() {
        if args[arg].eq("-c") { config_file = args[arg + 1].clone() }
    }
    let file = File::open(&config_file).unwrap();

    let client_configs: Vec<ClientConfig> = serde_json::from_reader(file).unwrap();
    let mut first_link = Address::default();
    for client in client_configs {
        println!("Request in config? {}", client.req_input.is_some());
        let ann_link: Address = spawn_oracle(client_store.clone(), &client, executor.clone()).await.unwrap();
        println!("Announcement link for oracle {}: {}", client.node_config.id, ann_link);
        if first_link.eq(&Address::default()) { first_link = ann_link }
    }

    let pub_payload = "A public payload".as_bytes().to_vec();
    let masked_payload = "A masked payload".as_bytes().to_vec();

    let retriever_config = RetrieverConfig { id: "A retriever".to_string(), node: "http://192.168.1.68:14265".to_string(), address: first_link.to_string() };

    //let start = std::time::SystemTime::now();
    //for _ in 0..100_u8 {
    //    attach_message(client_store.clone(), &client_config, pub_payload.clone(), masked_payload.clone()).await.unwrap();
    //}

    for _ in 0..20_u8 {
        //println!("Waiting... {}", start.elapsed().unwrap().as_secs());
        tokio::time::sleep(std::time::Duration::from_millis(1000)).await;
    }

    let fetch_start = std::time::SystemTime::now();
    println!("Fetching Msgs...");
    let msgs = retrieve_messages(retriever_store.clone(), &retriever_config).await.unwrap();
    println!("{} messages found in {} seconds", msgs.len(), fetch_start.elapsed().unwrap().as_secs());

    println!("Complete");
    Ok(())
}









