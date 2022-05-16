/**
 * Ce fichier à pour but d'insérer en BDD des données de films, d'utilisateurs, de catégories de
 * film et de critiques. Les données de films sont récupérées de l'API omdb si aucun fichier
 * seeding.json n'est présent dans le même répertoire. Pensez à indiquer votre clé d'API dans le
 * .env avant d'exécuter ce fichier s'il n'y a pas de fichier seeding.json.
 *
 * L'exécution de ce script est présente dans le script resetDB et initDB
 */
require('dotenv').config();
const faker = require('faker');
const debug = require('debug')('seeding');
const data = require('./data.json');

const db = require('../app/db/pg');

faker.locale = 'fr';

// Seeding for JOB
async function insertJobItems() {
    await db.query('TRUNCATE TABLE "job" RESTART IDENTITY CASCADE');
    const values = data.jobs.map((item) => `(
        '${item.label}'
    )`);
    const queryStr = `
        INSERT INTO "job"
        (
            "label"
        )
        VALUES ${values}
        RETURNING id
    `;
    const result = await db.query(queryStr);
    return result.rows.map((item) => item.id);
}

// Seeding for CATEGORY
async function insertCategoryItems() {
    await db.query('TRUNCATE TABLE "category" RESTART IDENTITY CASCADE');
    const values = data.categories.map((item) => `(
        '${item.label}'
    )`);
    const queryStr = `
        INSERT INTO "category"
        (
        "label"
        )
        VALUES ${values}
        RETURNING id
    `;
    const result = await db.query(queryStr);
    return result.rows.map((item) => item.id);
}

// Seeding for CAREGIVER
async function insertCaregiverItems() {
    await db.query('TRUNCATE TABLE "caregiver" RESTART IDENTITY CASCADE');
    const values = data.caregivers.map((item) => `(
        '${item.firstname}',
        '${item.lastname}',
        '${item.status}',
        '${item.gender}',
        '${item.sector}',
        '${item.online_appointment}'
    )`);
    const queryStr = `
        INSERT INTO "caregiver"
        (
            "firstname",
            "lastname",
            "status",
            "gender",
            "sector",
            "online_appointment"
        )
        VALUES ${values}
        RETURNING id
    `;
    const result = await db.query(queryStr);
    return result.rows.map((item) => item.id);
}

// Seeding for PLACE
async function insertPlaceItems() {
    await db.query('TRUNCATE TABLE "place" RESTART IDENTITY CASCADE');
    const values = data.places.map((item) => `(
        '${item.label}',
        '${item.street}',
        '${item.postcode}',
        '${item.city}',
        '${item.lat}',
        '${item.long}',
        '${item.caregiver_id}'
    )`);
    const queryStr = `
        INSERT INTO "place"
        (
            "label",
            "street",
            "postcode",
            "city",
            "lat",
            "long",
            "caregiver_id"
        )
        VALUES ${values}
        RETURNING id
    `;
    const result = await db.query(queryStr);
    return result.rows.map((item) => item.id);
}

(async () => {
    const [jobIds, categoryIds, caregiverIds, placeIds] = await Promise.all([
        insertJobItems(),
        insertCategoryItems(),
        insertCaregiverItems(),
        insertPlaceItems(),
    ]);
    debug(`${jobIds.length} jobs inserted`);
    debug(`${categoryIds.length} categories inserted`);
    debug(`${caregiverIds.length} caregivers inserted`);
    debug(`${placeIds.length} places inserted`);

    db.originalClient.end();
})();
