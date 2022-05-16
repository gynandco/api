BEGIN;

-- DROP TABLES
DROP TABLE IF EXISTS "job";
DROP TABLE IF EXISTS "category";
DROP TABLE IF EXISTS "tag";
DROP TABLE IF EXISTS "language";
DROP TABLE IF EXISTS "comment";
DROP TABLE IF EXISTS "place";
DROP TABLE IF EXISTS "caregiver";
DROP TABLE IF EXISTS "caregiver_category";

-- DROP TYPES
DROP TYPE IF EXISTS "caregiver_status";
DROP TYPE IF EXISTS "caregiver_gender";
DROP TYPE IF EXISTS "caregiver_sector";

-- CREATE TYPES
CREATE TYPE caregiver_status AS ENUM ('published', 'private', 'draft');
CREATE TYPE caregiver_gender AS ENUM ('femme', 'homme', 'NC');
CREATE TYPE caregiver_sector AS ENUM ('1', '2', 'NC');

-- CREATE TABLES
CREATE TABLE "job" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL UNIQUE
);

CREATE TABLE "category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL UNIQUE
);

CREATE TABLE "tag" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL UNIQUE
);

CREATE TABLE "language" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL UNIQUE
);

CREATE TABLE "caregiver" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "status" caregiver_status NOT NULL,
    "gender" caregiver_gender NOT NULL,
    "sector" caregiver_sector NOT NULL,
    "online_appointment" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "place" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT,
    "street" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "lat" DECIMAL(8,6) NOT NULL,
    "long" DECIMAL(9,6) NOT NULL,
    "caregiver_id" INT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "comment" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "content" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "caregiver_id" INT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

-- CREATE RELATION TABLES
CREATE TABLE "caregiver_category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "caregiver_id" INT NOT NULL,
    "category_id" INT NOT NULL
);

CREATE TABLE "caregiver_tag" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "caregiver_id" INT NOT NULL,
    "tag_id" INT NOT NULL
);

CREATE TABLE "caregiver_language" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "caregiver_id" INT NOT NULL,
    "language_id" INT NOT NULL
);

-- CREATE CONSTRAINTS
-- ALTER TABLE place ADD CONSTRAINT fk_caregiver FOREIGN KEY (caregiver_id) REFERENCES caregiver (id);

COMMIT;