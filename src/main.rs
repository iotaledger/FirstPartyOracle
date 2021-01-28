use oracle::{
    store::{ClientStore, RetrieverStore},
    threads::Executor,
    http::api_server,
    Result,
};
use tokio::sync::Mutex;
use std::sync::Arc;


#[tokio::main]
async fn main() -> Result<()> {
    let  client_store = Arc::new(Mutex::new(ClientStore::init()));
    let retriever_store = Arc::new(Mutex::new(RetrieverStore::init()));
    let executor = Executor::init(client_store.clone());

    let mut port: u16 = 8080;

    let args: Vec<String> = std::env::args().collect();
    for arg in 0..args.len() {
        if args[arg].eq("-p") { port = args[arg + 1].parse::<u16>().unwrap() }
    }

    api_server::start(port, client_store.clone(), retriever_store.clone(), executor.clone()).await?;
    Ok(())
}









