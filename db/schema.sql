CREATE TABLE locations (
    id INT,
    name TEXT NOT NULL,
    PRIMARY KEY( id )
);

CREATE TABLE systems (
    id INT,
    name TEXT NOT NULL,
    PRIMARY KEY( id )
);

CREATE TABLE types (
    id INT,
    name TEXT NOT NULL,
    PRIMARY KEY( id )
);

CREATE TABLE orders (
    id INT,
    duration INT NOT NULL,
    is_buy_order BOOL NOT NULL,
    issued DATE NOT NULL, 
    location_id INT NOT NULL REFERENCES locations(id),
    min_volume INT NOT NULL,
    range TEXT NOT NULL,
    system_id INT NOT NULL REFERENCES systems,
    type_id INT NOT NULL REFERENCES types,
    volume_total INT NOT NULL,
    PRIMARY KEY( id )
);

CREATE TABLE api_response (
    region INT NOT NULL,
    page INT NOT NULL,
    etag TEXT,
    expires DATE NOT NULL,
    last_modified DATE NOT NULL,
    PRIMARY KEY( etag )
);

CREATE TABLE order_observation (
    price NUMERIC(12,2),
    volume_remain INT,
    order_id INT NOT NULL REFERENCES orders,
    response TEXT NOT NULL REFERENCES api_response,
    PRIMARY KEY ( response, order_id )
);
