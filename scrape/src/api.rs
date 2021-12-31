use hyper_tls::HttpsConnector;
use hyper::Client;
use hyper::http::{ Request };
use chrono::prelude::*;

enum RegionId {
    Forge, 
    Gorge
}

enum TypeId {
    Forge, 
    Gorge
}

pub struct Responses {
    Body: string
    Etag:
}

pub struct EveApi{
    base_uri: String,
    client: Client
} 

impl EveApi {

    pub async fn orders(&mut self, region_id: RegionId) -> &mut Query {
        let request = Request::builder()
        .uri(format!("market/{}/orders/", region_id))
        .header("datasource", "")
        .body(())
        .unwrap();

        let res = client.get(Uri::from_static("http://httpbin.org/ip")).await?;

    }

    pub async fn history(&mut self, region_id: RegionId, type_id: TypeId) -> &mut Query {
        panic!()
    }
    pub async fn prices(&mut self, region_id: RegionId) -> &mut Query {
        panic!() 
    }
    pub async fn types(&mut self, region_id: RegionId) -> &mut Query {
    }
}

impl Default for EveApi {
    fn default() -> Self {
        let https = HttpsConnector::new();
        let client = Client::builder().build::<_, hyper::Body>(https);

        EveApi {
            base_uri: "https://esi.evetech.net/latest/",
            client
        }
    }
}