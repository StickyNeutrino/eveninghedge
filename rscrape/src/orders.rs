use json;

struct order_cache_value {
    price: f64;
    volume_remain u32;
}

trait Order {
    fn order_id(&self) -> Option<u64>;
    //fn cache_value() -> order_cache_value;
}

impl Order for str {
    fn order_id(&self) -> Option<u64> {
        json::parse(&self)?["order_id"].as_u64()? 
    }

    fn cache_value() -> order_cache_value {
        order_cache_value {
            json::parse(&self)?["price"].as_u64()? ,
            json::parse(&self)?["volume_remain"].as_u32()? 
        }

    }
}

/*
order_id BIGINT,
duration INT NOT NULL,
is_buy_order BOOL NOT NULL,
issued DATE NOT NULL, 
location_id BIGINT NOT NULL,
min_volume BIGINT NOT NULL,
range TEXT NOT NULL,
system_id INT NOT NULL,
type_id INT NOT NULL,
volume_total INT NOT NULL,
price NUMERIC(14,2),
volume_remain INT, */
