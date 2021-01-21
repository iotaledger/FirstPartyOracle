use crate::{
    store::{ClientStore, RetrieverStore},
    threads::Executor,
    http::{attach_message, retrieve_messages},
};
use std::{
    net::SocketAddr,
    sync::Arc,
};

use hyper::{service::{make_service_fn, service_fn}, Request, Body, Response, StatusCode, Method, Server};
use tokio::sync::Mutex;
use anyhow::Result;

static NOTFOUND: &[u8] = "Not found".as_bytes();
type GenericError = Box<dyn std::error::Error + Send + Sync>;

pub async fn start(
    port: u16,
    client_store: Arc<Mutex<ClientStore>>,
    retriever_store: Arc<Mutex<RetrieverStore>>
) -> Result<()>{
    let addr = SocketAddr::from(([0,0,0,0], port));

    let service = make_service_fn(move |_| {
        let clients = client_store.clone();
        let retrievers = retriever_store.clone();

        async {
            Ok::<_, GenericError>(service_fn(move |req| {
                responder(req, clients.clone(), retrievers.clone())
            }))
        }
    });

    let server = Server::bind(&addr).serve(service);

    server.await?;

    Ok(())
}

async fn responder(
    req: Request<Body>,
    client_store: Arc<Mutex<ClientStore>>,
    retriever_store: Arc<Mutex<RetrieverStore>>,
) -> Result<Response<Body>> {
    match(req.method(), req.uri().path()) {
        (&Method::POST, "/attach_to_oracle") => attach_message(req, client_store.clone()).await,
        (&Method::GET, "/fetch_from_oracle") => retrieve_messages(req, retriever_store.clone()).await,
        _ => Ok(Response::builder().status(StatusCode::NOT_FOUND).body(NOTFOUND.into()).unwrap())
    }
}