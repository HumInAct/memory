CREATE TABLE IF NOT EXISTS NODE (
	name text PRIMARY KEY,
	time timestamp DEFAULT NOW(),
	properties json
);