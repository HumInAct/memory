CREATE TABLE FRIEND (
	username text PRIMARY KEY,
	email text,
	password text,
	registered timestamp DEFAULT NOW()
);