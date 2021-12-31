mod api;

use api::{EveApi};


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let api: EveApi = Default::default();

    api.orders()
    .add_listener(file_saver)
    .add_listener()
} 
