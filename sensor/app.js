// import SendUpdate from "./SendUpdate";
let occupied = false;

const http = require("http");
const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');
const express = require("express");
const PORT = 8080;
const app = express();
const serialPort = new SerialPort('/dev/cu.usbmodem14201', {
    baudRate: 9600,
});

const parser = serialPort.pipe(new ReadLine({ delimiter: '\r\n'}));

app.get("/", (req,res) => {
    res.send("Did this");
});

app.listen(PORT, () => {
    console.log(`GO TO: http://localhost:${PORT}`);
});

parser.on('data', (data) => {
    if (data === "occupied" && !occupied) {
        console.log("Switching to occupied");
        occupied = true;
        sendUpdate("one", 0);
    } else if (data !== "occupied" && occupied) {
        console.log("Switching to unoccupied");
        occupied = false;
        sendUpdate("one", 1);
    } else {
        console.log("Doing nothing");
    }
});

function sendUpdate(id, status) {
    console.log(id);
    let options = {
        host: "localhost",
        port: 3000,
        path: "/bike-racks/"+id,
        method: "PUT",
    };

    let req = http.request(options, (res) => {
        let responseString = "";

        res.on("data", function (data) {
            responseString += data;
        });

        res.on("end", function () {
            console.log(responseString);
        });

    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    let body = "1";
    req.write(body);
    req.end();
}
