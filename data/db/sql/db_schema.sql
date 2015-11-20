
DROP TABLE NODE;
CREATE TABLE IF NOT EXISTS NODE (name text PRIMARY KEY, time timestamp DEFAULT NOW(), properties json);
ALTER TABLE NODE ALTER COLUMN time SET DEFAULT now();
SELECT * FROM NODE;

DROP TABLE RELATION;
CREATE TABLE IF NOT EXISTS RELATION (
	id serial PRIMARY KEY,
	name text NOT NULL,
	time timestamp DEFAULT NOW(),
	properties json,
	node_a text NOT NULL REFERENCES NODE(name),
	node_b text REFERENCES NODE(name),
	node_c text REFERENCES NODE(name)
);
ALTER TABLE RELATION ALTER COLUMN node_b DROP NOT NULL;
SELECT * FROM RELATION;