const axios = require('axios');
const fs = require("fs");
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const FILE_PATH = __dirname+'/../data/sauna-openingstijden.json';

async function searchPlace(query) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                input: query,
                inputtype: 'textquery',
                fields: 'place_id'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error.response.data);
        throw error;
    }
}

// Laad de sauna's uit het JSON-bestand
const saunas = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

// Loop over de sauna's en haal de PLACES_ID op voor elk van hen
async function fetchAndUpdatePlacesIds() {
    for (let saunaObj of saunas) {
        const saunaName = Object.keys(saunaObj)[0];
        
        // Alleen de PLACES_ID ophalen als het nog niet bestaat voor de sauna
        if (!saunaObj[saunaName].PLACES_ID) {
            try {
                const data = await searchPlace(saunaName);
                const placeId = data.candidates && data.candidates[0] ? data.candidates[0].place_id : null;

                if (placeId) {
                    saunaObj[saunaName].PLACES_ID = placeId;
                }
            } catch (err) {
                console.error(`Error fetching PLACES_ID for ${saunaName}:`, err.message);
            }
        }
    }

    // Update het JSON-bestand met de nieuwe PLACES_IDs
    //fs.writeFileSync(FILE_PATH, JSON.stringify(saunas, null, 4));

    return saunas
}

module.exports = fetchAndUpdatePlacesIds;