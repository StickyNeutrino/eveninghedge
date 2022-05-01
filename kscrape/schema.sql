

CREATE TABLE regions (
  region_id INT,
  name TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY( region_id )
);

CREATE TABLE constellations (
  constellation_id INT,
  name TEXT NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  z FLOAT NOT NULL,
  region_id INT NOT NULL regions,
  PRIMARY KEY( constellation_id )
);

CREATE TABLE systems (
  system_id INT,
  constellation_id INT NOT NULL constellations,
  name TEXT NOT NULL,
  PRIMARY KEY( system_id )
);

CREATE TABLE stations (
  station_id INT,
  name TEXT,
  system_id INT NOT NULL systems,
  PRIMARY KEY( station_id )
);

CREATE TABLE structures (
  structure_id INT,
  name TEXT NOT NULL,
  system_id INT NOT NULL systems,
  PRIMARY KEY( structure_id )
);

CREATE TABLE locations (
  id BIGINT,
  name TEXT,
  type TEXT NOT NULL,
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
  location_id INT NOT NULL,
  min_volume INT NOT NULL,
  range TEXT NOT NULL,
  system_id INT NOT NULL,
  type_id INT NOT NULL,
  volume_total INT NOT NULL,
  PRIMARY KEY( id )
);

CREATE TABLE api_response (
  response_id SERIAL,
  region INT NOT NULL,
  page INT NOT NULL,
  headers JSON NOT NULL,
  PRIMARY KEY( response_id )
);

CREATE TABLE order_observation (
  price NUMERIC(12,2),
  volume_remain INT,
  order_id INT NOT NULL FOREIGN KEY REFERENCES orders,
  response SERIAL NOT NULL FOREIGN KEY REFERENCES api_response,
  PRIMARY KEY ( response, order_id )
);
