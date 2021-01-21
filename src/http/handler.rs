use std::sync::Arc;
use tokio::sync::Mutex;
use crate::{
    store::{ClientStore, RetrieverStore},
    config::{ClientConfig, RetrieverConfig},
    threads::Executor,
    client::{Client, Retriever},
    message::{MessageContents, RetrievedMessage}
};
use anyhow::Result;
use hyper::{Body, Request, Response, StatusCode, header::CONTENT_TYPE, };
use crate::message::SendMessage;
use serde::Serialize;


pub async fn spawn_oracle(client_store: Arc<Mutex<ClientStore>>, config: &ClientConfig, executor: Arc<Mutex<Executor>>) -> Result<String> {
    println!("Making Client");
    let client = Client::new(&config).unwrap();
    let addr = client.get_ann_link().clone();

    println!("Storing Client");
    client_store.lock().await.add_client(config.node_config.id.as_bytes().to_vec(), client);

    if config.req_input.is_some() {
        println!("Spawning a requester");
        Executor::spawn_requester(executor.clone(), config)?;
    }
    Ok(addr.to_string())
}


pub async fn attach_message(
    req: Request<Body>,
    client_store: Arc<Mutex<ClientStore>>,
) -> Result<Response<Body>> {
    let req_data = hyper::body::to_bytes(req.into_body()).await.unwrap();
    let response;

    let req_struct: serde_json::Result<SendMessage> = serde_json::from_slice(&req_data);
    match req_struct {
        Ok(msg) => {
            let mut clients = client_store.lock().await;
            match clients.get_client(&msg.id) {
                Some(client) => {
                    let msg = msg.get_message();
                    client.add_message(&msg).unwrap();
                    response = respond(StatusCode::ACCEPTED, "Message added to oracle".to_string())?;
                },
                None => {
                    response = respond(StatusCode::NOT_FOUND, "Referenced client was not found".to_string())?;
                }
            }
        },
        Err(e) => {
            response = respond(StatusCode::BAD_REQUEST,"Malformed json request".to_string())?;
        }
    }
    Ok(response)
}

pub async fn retrieve_messages(
    req: Request<Body>,
    retriever_store: Arc<Mutex<RetrieverStore>>,
) -> Result<Response<Body>> {
    let req_data = hyper::body::to_bytes(req.into_body()).await.unwrap();
    let response;

    let config: serde_json::Result<RetrieverConfig> = serde_json::from_slice(&req_data);
    match config {
        Ok(config) => {
            let mut retrievers = retriever_store.lock().await;
            match retrievers.get_retriever(&config.id.as_bytes()) {
                Some(retriever) => {
                    let msgs = retriever.fetch_msgs().await.unwrap();
                    response = respond(StatusCode::FOUND, serde_json::to_string(&msgs).unwrap())?
                }
                None => {
                    let mut retriever = Retriever::new(&config).unwrap();
                    let msgs = retriever.fetch_msgs().await.unwrap();
                    response = respond(StatusCode::FOUND, serde_json::to_string(&msgs).unwrap())?
                }
            }
        },
        Err(_) => {response = respond(StatusCode::BAD_REQUEST, "Error parsing configuration".to_string())?}
    }
    Ok(response)

}

fn respond(status: StatusCode, msg: String) -> Result<Response<Body>> {
    Ok(Response::builder()
        .status(status)
        .header(CONTENT_TYPE, "application/json")
        .body(Body::from(msg)).unwrap())
}
