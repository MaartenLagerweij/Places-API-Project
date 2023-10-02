const fs = require('fs');

const FILE_PATH = __dirname+'/../data/sauna-openingstijden2.json';

const saunas = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));

function convertTo24Hour(timeString) {
    if (!timeString) {
        //console.error("Error: timeString is undefined");
        return "";
    }
    if (timeString === "Open 24 hours") {
        return "00:00–23:59";
    }
    
    // Als er geen modifier (AM/PM) is, dan gaan we ervan uit dat het PM is.
    let [time, modifier] = timeString.split(/\s/);
    if (!modifier) {
        modifier = "PM";
    }

    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }

    if (modifier.toLowerCase() === 'pm') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}



saunas.forEach(sauna => {
    const saunaData = Object.values(sauna)[0];
    if (saunaData.openingstijden && typeof saunaData.openingstijden == 'object') {
        saunaData.openingstijden = saunaData.openingstijden.map(day => {
            const [dayName, times] = day.split(': ');
            if (times === "Closed") return `${dayName}: Gesloten`;
            const [start, end] = times.split('–').map(s => s.trim());
            return `${dayName}: ${convertTo24Hour(start)}–${convertTo24Hour(end)}`;
        });
    }
});

fs.writeFileSync(FILE_PATH, JSON.stringify(saunas, null, 2));

//console.log("Times formatted and saved.");
