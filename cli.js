const {program} = require('commander');

const getPlaceIDs = require('./functions/getPlaceIDs');
const getOpeningData = require('./functions/getOpeningData');

program
    .command('fetch-place-ids')
    .description('Fetch the Place_ID\'s from the Places API')
    .action(getPlaceIDs);

program
    .command('fetch-opening-times')
    .description('Fetch the missing opening times')
    .action(getOpeningData);

program
    .command('fetch-all')
    .description('Fetch Place_IDs and then Opening Times')
    .action(async () => {
        const saunaData = await getPlaceIDs();
        await getOpeningData(saunaData);
    })

program.parse(process.argv);