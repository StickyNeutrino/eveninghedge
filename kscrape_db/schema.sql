

CREATE TABLE regions (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE constellations (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE systems (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE stations (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE structures (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE types (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE groups (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE categories (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE graphics (
  id INT,
  info JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE market_queries (
  id BIGSERIAL ,
  type TEXT,
  query JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE orders (
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
  volume_remain INT,
  PRIMARY KEY( order_id )
);

CREATE TABLE order_observations (
  price NUMERIC(14,2),
  volume_remain INT,
  order_id BIGINT NOT NULL REFERENCES orders,
  query_id BIGINT NOT NULL REFERENCES market_queries( id ),
  PRIMARY KEY ( order_id, query_id )
);
