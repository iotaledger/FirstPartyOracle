# First Party Oracle - Alpha 
First Party Oracles are tools for data providers to create public streaming channels over the tangle in a templated and easily retrieved fashion. Much like MAM (Masked Authenticated Messaging), messages are chained/sequenced one after another and can be retrieved iteratively. To host these oracles, a user will need to have a running container instance on their machine. This container will act as a housing for any oracles or retrievers that will be generated. 

There are 2 primary targets for the oracle implementation: 
- Data sources
- Api sources

Once an oracle is generated, any user who is provided with a Channel Id from the spawning party will be able to spawn a retriever in any oracle container and fetch the messages from the tangle.

### Dependencies
Users will require the latest stable rust to run the container. 
<br/>
A simple `cargo run` should be all you need from this point. Once the package is installed, the container will start up. 

### Options 
A container can be spawned with the following options <br/>

|Arg   | Description   |
|---|---|
| *-p* | *Sets the port that the container will operate on. (Default: 8080)*  |
| *-c* | *Sets the container to spawn the preconfigured oracles on startup*  |


## Oracles 
A container can be started with a preset list of oracle configurations, or they can be fed through the `spawn_oracle` api using the following formatting: 
```
{
  "node_config": {
    "id": "Client Id Here",                       - Unique Identifier
    "node": "https://nodes.devnet.iota.org:443",  - Node endpoint for the tangle
    "whitelist": ["127.0.0.1"]                    - List of whitelisted source IP's
  },
  "send_options": {                               - Client options for sending to tangle
    "depth": 1,                                   
    "min_weight_magnitude": 9,                     
    "local_pow": true,
    "threads": 1
  },
  "req_input": {                                  - Can be null if no api source provided
    "ticker": 2000,                               - Frequency of api call (milliseconds)
    "request": { 
      "url": "<Some Endpoint Here>",              - Endpoint for api call
      "header": {
        "header key": "header value"              - Header's for api call mapped
      },
      "body": {
        "body key": "body value"                  - Body for api call mapped
      }
    }
  }
}

```

A preconfigured file to be used on launch must wrap the above formatted configurations in a list: 

```
[
  ConfigOracle1,
  ConfigOracle2,
]
```


## Retrievers 
An oracle container can host several retrievers, and the configuration for setting up a retriever is as follows: 
```
{
  "id": "<Retriever Id>",
  "node": "https://nodes.devnet.iota.org:443",
  "address": "<Channel Id>"
}
```


Note: *A retriever will keep track of the state of retrieval when fetching from the tangle, so once data has been retrieved, it should be stored locally or acted upon.* 



## Api 
| Command  | Inputs  | Outputs  |  Description  |
|----------|---------|----------|---------------|
| spawn_oracle | JSON formatted oracle configuration as presented above | pk [string] - Hex Representation of Oracle Author Public Key <br/> address [string] - Oracle Channel Id | This call allows a user to spawn a new oracle instance on the container. This instance will either automatically populate the tangle with the provided API source data, or will be open to manually attaching data from whitelisted IP sources. |
| get_channel_id | id [string] - Oracle Identifier | Channel ID [string] - Oracle Channel Endpoint| This call allows the user to fetch the Channel Id from an existing oracle in the container by id |
| attach_to_oracle | <pre>id [string] - Oracle Identifier <br/>message: {<br/>  public [byteArray] - Public Payload array,<br/>  masked [byteArray] - Masked Payload array<br/>}</pre>  | Success Message  | This call allows a device to attach to an existing oracle provided it has been whitelisted in the configurations.  |
| fetch_from_oracle| JSON formatted retriever configuration as presented above | <pre>[<br/>  {<br/>    tag [string] - Message Identifier for transaction,<br/>    pk [string] - Hex Representation of Oracle Author Public Key,<br/>    contents: {<br/>      public [byteArray] - Public Payload array,<br/>      masked [byteArray] - Masked Payload array<br/>    }<br/>  }<br/>]</pre>| This call allows a user to generate or use an existing Oracle Retriever to fetch data from an Oracle stream |


