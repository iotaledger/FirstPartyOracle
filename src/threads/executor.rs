use crate::message::message::MessageContents;
use crate::Result;
use std::sync::Arc;
use tokio::{
    sync::{Mutex},
    time::delay_for,
};
use core::time::Duration;
use std::thread::sleep;
use crate::store::ClientStore;
use anyhow::anyhow;
use crate::config::ReqInput;

pub struct Job {
    pub client_id: Vec<u8>,
    msg: MessageContents,
}

impl Job {
    pub fn new(client_id: Vec<u8>, msg: MessageContents) -> Job {
        Job { client_id, msg }
    }

    pub fn get_message(&self) -> &MessageContents {
        &self.msg
    }

    pub fn get_client_id(&self) -> &Vec<u8> { &self.client_id }

    pub fn eq(&self, job: &Job) -> bool {
        return (self.client_id.eq(&job.client_id)) && (self.msg.eq(&job.msg))
    }
}

pub struct JobList {
    jobs: Vec<Job>,
}

impl JobList {
    pub fn get_next_job(&self) -> Option<&Job> {
        self.jobs.first()
    }
}

pub struct Executor {
    clients: Arc<Mutex<ClientStore>>,
    job_list: JobList
}

impl Executor {
    pub fn init(clients: Arc<Mutex<ClientStore>>) -> Arc<Mutex<Executor>> {
        let job_list = JobList { jobs: Vec::<Job>::new() };
        let executor = Arc::new(Mutex::new(Executor { clients, job_list }));
        Executor::spawn_thread(executor.clone()).unwrap();
        executor
    }

    fn spawn_thread(executor: Arc<Mutex<Executor>>) -> Result<()>{
        let executor1 = executor.clone();
        tokio::spawn(async move {
            loop {
                Executor::get_jobs(executor.clone()).await.unwrap();
                sleep(Duration::from_millis(100));
            }
        });
        tokio::spawn(async move {
            loop {
                Executor::handle_jobs(executor1.clone()).await.unwrap();
                sleep(Duration::from_millis(100));
            }
        });
        Ok(())
    }

    pub fn spawn_requester(executor: Arc<Mutex<Executor>>, id: Vec<u8>, req: ReqInput) -> Result<()> {
        tokio::spawn( async move {
            loop {
                let ticker = req.ticker as u128;
                let start = std::time::SystemTime::now();
                Executor::send_request(executor.clone(), ReqInput::from(&req), &id).await.unwrap();
                let elapsed = start.elapsed().unwrap().as_millis();
                if ticker > elapsed {
                    let wait = ticker - start.elapsed().unwrap().as_millis();
                    delay_for(Duration::from_millis(wait as u64)).await
                }
            }
        });
        Ok(())
    }

    async fn send_request(executor: Arc<Mutex<Executor>>, req: ReqInput, id: &[u8]) -> Result<()> {
        let executor = executor.lock().await;
        let mut clients = executor.clients.lock().await;
        let client = clients.get_client(id).unwrap();

        match req.request.get() {
            Ok(res) => {
                client.add_message(&MessageContents::new(
                        Vec::new(),
                        res. into_string().unwrap().as_bytes().to_vec()
                ))?;
                Ok(())
            },
            Err(e) => {
                println!("Error in requester for client {}. Data not added to oracle.\nCause: {}",
                         String::from_utf8(client.id.clone()).unwrap(),
                         e
                );
                Ok(())
            }
        }
    }

    async fn get_jobs(executor: Arc<Mutex<Executor>>) -> Result<()> {
        let mut executor = executor.lock().await;
        let mut clients = executor.clients.lock().await;
        let mut jobs = Vec::new();

        let mut iter = clients.iter();

        loop {
            match iter.next() {
                Some((id, client)) => {
                    loop {
                        match client.get_next_message() {
                            Some(msg) => {
                                let job = Job::new(id.clone(), MessageContents::from(&msg));
                                jobs.push(job);
                                client.remove_message(&msg)?;
                            },
                            None => break
                        }
                    }
                },
                None => break
            }
        }

        std::mem::drop(clients);
        for job in jobs {
            executor.add_job(job).unwrap();
        }

        Ok(())
    }

    async fn handle_jobs(executor: Arc<Mutex<Executor>>) -> Result<()>{
        loop {
            let mut executor = executor.lock().await;
            let next_job = executor.job_list.get_next_job();
            if let Some(job) = next_job {
                let mut clients = executor.clients.lock().await;
                let client = clients.get_client(job.get_client_id())
                    .ok_or_else(|| anyhow!("Error fetching client"));
                client.unwrap().send_message(job.get_message()).await.unwrap();
                std::mem::drop(clients);
                executor.job_list.jobs.remove(0);
            } else {
                break;
            }
        }

        Ok(())
    }


    pub fn add_job(&mut self, job: Job) -> Result<()> {
        Ok(self.job_list.jobs.push(job))
    }


}
