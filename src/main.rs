use oracle::{
    store::{ClientStore, RetrieverStore},
    threads::Executor,
    http::{spawn_oracle, api_server},
    config::ClientConfig,
    Result,
};
use tokio::sync::Mutex;
use std::sync::Arc;
use std::fs::File;
use anyhow::anyhow;


#[tokio::main]
async fn main() -> Result<()> {
    let  client_store = Arc::new(Mutex::new(ClientStore::init()));
    let retriever_store = Arc::new(Mutex::new(RetrieverStore::init()));
    let executor = Executor::init(client_store.clone());

    let mut port: u16 = 8080;
    let mut config_file = "ClientConfigs.json".to_string();

    let args: Vec<String> = std::env::args().collect();
    for arg in 0..args.len() {
        if args[arg].eq("-c") { config_file = args[arg + 1].clone() }
        else if args[arg].eq("-p") { port = args[arg + 1].parse::<u16>().unwrap() }
    }

    if let Ok(file) = File::open(&config_file) {
        let client_configs: serde_json::Result<Vec<ClientConfig>> = serde_json::from_reader(file);
        if client_configs.is_err() {
            return Err(anyhow!("Malformed configuration: {}", client_configs.err().unwrap()))
        }
        for client in client_configs.unwrap() {
            let id = client.node_config.id.clone();
            let ann_link = spawn_oracle(client_store.clone(), client, executor.clone()).await.unwrap();
            println!("Announcement link for oracle {}: {}", id, ann_link);
        }

        api_server::start(port, client_store.clone(), retriever_store.clone()).await?;
        Ok(())
    } else {
        Err(anyhow!("Failed to open configuration file"))
    }
}









