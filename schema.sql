DROP TABLE IF EXISTS locationIq;
CREATE TABLE locationIq(
    id  SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query_IQ VARCHAR(255),
    latitude_IQ float,
    longitude_IQ float


);
INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ('new one','new',50.6516,30.115);
