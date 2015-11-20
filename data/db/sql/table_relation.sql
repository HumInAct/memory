CREATE TABLE IF NOT EXISTS RELATION (
	id serial PRIMARY KEY,
	name text NOT NULL,
	time timestamp DEFAULT NOW(),
	properties json,
	node_a text NOT NULL REFERENCES NODE(name),
	node_b text NOT NULL REFERENCES NODE(name),
	node_c text REFERENCES NODE(name)
);