-- Si database already exist
DROP DATABASE IF EXISTS gynandco;
DROP ROLE IF EXISTS gynandco_u;

CREATE ROLE gynandco_u WITH LOGIN PASSWORD 'gynandco';
CREATE DATABASE gynandco OWNER gynandco_u;
