const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal;
    temperature = temperature.replace("{%tempval%}", (orgVal.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", (orgVal.name));
    temperature = temperature.replace("{%country%}", (orgVal.sys.country));
    temperature = temperature.replace("{%tempstatus%}", (orgVal.weather[0].main));
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=6b7528034daeb1493c0b070595ebad5a")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("Connection closed due to error", err);
            res.end();
        });
    }
});

server.listen(12500, "127.0.0.1", () => {
    console.log("Server is listening on port 12500");
});
