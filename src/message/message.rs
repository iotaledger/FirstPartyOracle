use iota_streams::app_channels::api::tangle::PublicKey;
use serde::{Deserialize, Serialize};

#[derive(Hash, PartialEq, Eq, Serialize, Deserialize)]
pub struct MessageContents {
    public: Vec<u8>,
    masked: Vec<u8>,
}

impl MessageContents {
    pub fn new(public: Vec<u8>, masked: Vec<u8>) -> MessageContents {
        MessageContents { public, masked }
    }

    pub fn from(msg: &MessageContents) -> MessageContents {
        MessageContents {
            public: msg.public.clone(),
            masked: msg.masked.clone()
        }
    }

    pub fn get_public(&self) -> &Vec<u8> {
        self.public.as_ref()
    }

    pub fn get_masked(&self) -> &Vec<u8> {
        self.masked.as_ref()
    }
}


#[derive(Deserialize)]
pub struct SendMessage {
    pub id: String,
    message: MessageContents,
}

impl SendMessage {
    pub fn new(id: String, message: MessageContents) -> SendMessage {
        SendMessage { id, message }
    }

    pub fn get_message(&self) -> MessageContents {
        MessageContents::from(&self.message)
    }
}

#[derive(Serialize)]
pub struct RetrievedMessage {
    tag: String,
    pk: String,
    contents: MessageContents
}

impl RetrievedMessage {
    pub fn new(tag: String,pk: PublicKey, contents: MessageContents) -> RetrievedMessage {
        RetrievedMessage { tag,pk: hex::encode(pk.to_bytes()), contents }
    }

    pub fn get_contents(&self) -> &MessageContents {
        &self.contents
    }

    pub fn get_pk(&self) -> &str {
        &self.pk
    }

    pub fn get_tag(&self) -> &str {
        &self.tag
    }
}
