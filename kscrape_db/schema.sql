

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
  id SERIAL ,
  query JSONB,
  PRIMARY KEY( id )
);

CREATE TABLE orders (
  id INT,
  duration INT NOT NULL,
  is_buy_order BOOL NOT NULL,
  issued DATE NOT NULL, 
  location_id INT NOT NULL,
  min_volume INT NOT NULL,
  range TEXT NOT NULL,
  system_id INT NOT NULL,
  type_id INT NOT NULL,
  volume_total INT NOT NULL,
  PRIMARY KEY( id )
);

CREATE TABLE order_observations (
  price NUMERIC(12,2),
  volume_remain INT,
  order_id INT NOT NULL REFERENCES orders( id ),
  query_id INT NOT NULL REFERENCES market_queries( id ),
  PRIMARY KEY ( order_id, query_id )
);
