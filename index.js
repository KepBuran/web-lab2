const fs = require('fs');
const xml2js = require('xml2js');
const readline = require('readline');

// Функція для читання XML-файлу та парсингу його в JSON
function readXMLFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
}

// Функція для пошуку зустрічей за датою
function searchMeetings(schedule, date) {
    return schedule.meeting.filter(meeting => meeting.date[0] === date);
}

// Функція для створення HTML-файлу з результатами пошуку
function createHTMLFile(meetings, outputPath) {
    if (meetings.length === 0) {
        fs.writeFileSync(outputPath, '<html><body><h1>No meetings found</h1></body></html>');
        return;
    }

    let htmlContent = `<html><body><h1>Meetings on ${meetings[0].date[0]}</h1><table style="border: 1px solid black; border-collapse: collapse;"><tr><th style="padding: 10px; border: 1px solid black;">Time</th><th style="padding: 10px; border: 1px solid black;">Person</th><th style="padding: 10px; border: 1px solid black;">Location</th></tr>`;
    meetings.forEach(meeting => {
        htmlContent += `<tr><td style="padding: 10px; border: 1px solid black;">${meeting.time[0]}</td><td style="padding: 10px; border: 1px solid black;">${meeting.person[0]}</td><td style="padding: 10px; border: 1px solid black;">${meeting.location[0]}</td></tr>`;
    });
    htmlContent += '</table></body></html>';
    fs.writeFileSync(outputPath, htmlContent);
}

// Функція для зчитування дати від користувача
function askDate() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the date (YYYY-MM-DD): ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    try {
        const xmlFilePath = 'schedule.xml';
        const outputHTMLPath = 'meetings.html';

        // Зчитування дати від користувача
        const date = await askDate(); //2024-06-03

        // Читання та парсинг XML-файлу
        const schedule = await readXMLFile(xmlFilePath);
        
        // Пошук зустрічей за введеною датою
        const meetings = searchMeetings(schedule.schedule, date);

        // Створення HTML-файлу з результатами пошуку
        createHTMLFile(meetings, outputHTMLPath);

        console.log('The HTML file has been created successfully.'); 
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
