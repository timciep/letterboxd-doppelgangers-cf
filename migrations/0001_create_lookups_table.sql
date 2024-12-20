-- Migration number: 0001 	 2024-12-20T21:43:12.480Z
DROP TABLE IF EXISTS lookups;

CREATE TABLE lookups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  favorites INT,
  matches INT,
  datetime TEXT
);