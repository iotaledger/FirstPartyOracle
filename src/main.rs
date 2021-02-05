use oracle::{
    store::{ClientStore, RetrieverStore},
    threads::Executor,
    http::{spawn_oracle_on_start, api_server},
    config::ClientConfig,
    Result, anyhow
};
use tokio::sync::Mutex;
use std::{
    sync::Arc,
    fs::File
};


#[tokio::main]
async fn main() -> Result<()> {
    let  client_store = Arc::new(Mutex::new(ClientStore::init()));
    let retriever_store = Arc::new(Mutex::new(RetrieverStore::init()));
    let executor = Executor::init(client_store.clone());

    // Configurable variables
    let mut port: u16 = 8080;
    let mut spawn_on_start = false;
    let mut config_file = "ClientConfigs.json";

    let args: Vec<String> = std::env::args().collect();
    for arg in 0..args.len() {
        if args[arg].eq("-p") { port = args[arg + 1].parse::<u16>().unwrap() }
        if args[arg].eq("-c") { spawn_on_start = true; config_file = &args[arg + 1]}
    }

    if spawn_on_start {
        if let Ok(file) = File::open(&config_file) {
            let client_configs: serde_json::Result<Vec<ClientConfig>> = serde_json::from_reader(file);
            match client_configs {
                Ok(configs) => {
                    for client in configs {
                        let id = client.node_config.id.clone();
                        let ann_link = spawn_oracle_on_start(client_store.clone(), client, executor.clone()).await.unwrap();
                        println!("Spawned oracle {}\n{}", id, ann_link);
                    }
                },
                Err(e) => return Err(anyhow!("Malformed configuration: {}", e))
            }
        }
    }

    api_server::start(port, client_store.clone(), retriever_store.clone(), executor.clone()).await?;
    Ok(())
}









