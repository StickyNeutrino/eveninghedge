

CREATE TABLE regions (
  region_id INT,
  info JSONB,
  PRIMARY KEY( region_id )
);

CREATE TABLE constellations (
  constellation_id INT,
  info JSONB,
  PRIMARY KEY( constellation_id )
);

CREATE TABLE systems (
  system_id INT,
  info JSONB,
  PRIMARY KEY( system_id )
);

CREATE TABLE stations (
  station_id INT,
  info JSONB,
  PRIMARY KEY( station_id )
);

CREATE TABLE structures (
  structure_id INT,
  info JSONB,
  PRIMARY KEY( structure_id )
);

CREATE TABLE types (
  type_id INT,
  info JSONB,
  PRIMARY KEY( type_id )
);

CREATE TABLE groups (
  group_id INT,
  info JSONB,
  PRIMARY KEY( group_id )
);

CREATE TABLE categories (
  category_id INT,
  info JSONB,
  PRIMARY KEY( category_id )
);

CREATE TABLE graphics (
  graphic_id INT,
  info JSONB,
  PRIMARY KEY( graphic_id )
);

