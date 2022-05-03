

CREATE TABLE regions (
  id INT,
  info JSONB,
  PRIMARY KEY( region_id )
);

CREATE TABLE constellations (
  id INT,
  info JSONB,
  PRIMARY KEY( constellation_id )
);

CREATE TABLE systems (
  id INT,
  info JSONB,
  PRIMARY KEY( system_id )
);

CREATE TABLE stations (
  id INT,
  info JSONB,
  PRIMARY KEY( station_id )
);

CREATE TABLE structures (
  id INT,
  info JSONB,
  PRIMARY KEY( structure_id )
);

CREATE TABLE types (
  id INT,
  info JSONB,
  PRIMARY KEY( type_id )
);

CREATE TABLE groups (
  id INT,
  info JSONB,
  PRIMARY KEY( group_id )
);

CREATE TABLE categories (
  id INT,
  info JSONB,
  PRIMARY KEY( category_id )
);

CREATE TABLE graphics (
  id INT,
  info JSONB,
  PRIMARY KEY( graphic_id )
);

CREATE TABLE market_queries (
  id: SERIAL,
  query: JOSNB,
  PRIMARY KEY( id )
);