use crate::{
    store::{ClientStore, RetrieverStore},
    http::{attach_message, retrieve_messages, get_channel_id},
};
use std::{
    net::SocketAddr,
    sync::Arc,
};
use hyper::{
    server::conn::AddrStream,
    service::{make_service_fn, service_fn},
    Request, Body, Response, StatusCode, Method, Server,
};

use tokio::sync::Mutex;
use anyhow::Result;
use crate::threads::Executor;
use crate::http::spawn_oracle;

static NOTFOUND: &[u8] = "Not found".as_bytes();
static NOTAUTH: &[u8] = "Oracles can only be spawned by local instance".as_bytes();

type GenericError = Box<dyn std::error::Error + Send + Sync>;

pub async fn start(
    port: u16,
    client_store: Arc<Mutex<ClientStore>>,
    retriever_store: Arc<Mutex<RetrieverStore>>,
    executor: Arc<Mutex<Executor>>
) -> Result<()> {
    let addr = SocketAddr::from(([0,0,0,0], port));

    let service = make_service_fn(move |s: &AddrStream| {
        let clients = client_store.clone();
        let retrievers = retriever_store.clone();
        let executor = executor.clone();
        let addr = s.remote_addr().ip().to_string();

        async {
            Ok::<_, GenericError>(service_fn(move |req| {
                responder(req, clients.clone(), retrievers.clone(), executor.clone(), addr.clone())
            }))
        }
    });

    let server = Server::bind(&addr).serve(service);
    println!("Server started at {}", port);
    server.await?;

    Ok(())
}

async fn responder(
    req: Request<Body>,
    client_store: Arc<Mutex<ClientStore>>,
    retriever_store: Arc<Mutex<RetrieverStore>>,
    executor: Arc<Mutex<Executor>>,
    addr: String
) -> Result<Response<Body>> {
    match(req.method(), req.uri().path()) {
        (&Method::POST, "/spawn_oracle") => {
            if addr == "127.0.0.1" {
                spawn_oracle(req, client_store.clone(), executor.clone()).await
            } else {
                Ok(Response::builder().status(StatusCode::UNAUTHORIZED).body(NOTAUTH.into()).unwrap())
            }
        },
        (&Method::POST, "/attach_to_oracle") => attach_message(req, client_store.clone(), &addr).await,
        (&Method::GET, "/get_channel_id") => get_channel_id(req, client_store.clone()).await,
        (&Method::POST, "/fetch_from_oracle") => retrieve_messages(req, retriever_store.clone()).await,
        _ => Ok(Response::builder().status(StatusCode::NOT_FOUND).body(NOTFOUND.into()).unwrap())
    }
}
