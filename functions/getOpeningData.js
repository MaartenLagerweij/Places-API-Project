const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const FILE_PATH = __dirname+'/../data/sauna-openingstijden.json';

//const saunas = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

async function getOpeningHours(place_id){
    try {
       const response = await axios.get(DETAILS_URL, {
        params: { 
            key: API_KEY,
            place_id: place_id,
            fields: 'opening_hours'
        }
       })
       if(response.data && response.data.result && response.data.result.opening_hours) return response.data.result.opening_hours.weekday_text;
       return null;
    }catch(err){
        console.error('Error with requestion Places API Opening time Data: ', err)
        return null;
    }
}

async function updateOpeninghours(saunas){
    for(let sauna of saunas){
        const saunaName = Object.keys(sauna)[0];
        if(!Object.values(sauna)[0]['openingstijden']) {
            const hours = await getOpeningHours(sauna[saunaName].PLACES_ID);
            hours ? sauna[saunaName].openingstijden = hours : sauna[saunaName].openingstijden = 'No times found'
        };
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(saunas, null, 2));
}

module.exports = updateOpeninghours;