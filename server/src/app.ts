import express from "express";
import API_KEY from "../cred/keys";
import FileReader from "./model/FileReader";
const app = express();
const PORT = 3000;

/**
 * Define RESTful endpoints here
 */
const BIKERACK_LIST = "/bike-racks";
const BIKERACK  = "/bike-racks/:id";

let bikeRacks: any = {};

/**
 * Main entry point
 */
// app.get("/", (req, res) => {
//     res.send("Nooo");
// });

/**
 * Chainable route for the bike rack endpoint
 * Allows for getting a particular bike rack,
 *  and to update a bike rack
 * req.params.id contains bike rack ID
 */
app.route(BIKERACK)
    .get((req, res) => {
        res.send(bikeRacks[req.params.id]);
        // TODO: implement
    })
    .put((req, res) => {
        if (bikeRacks["0"].available === 0) {
            bikeRacks["0"].available = 1;
        } else {
            bikeRacks["0"].available = 0;
        }
        res.send("Put a Bike Rack");
    });

/**
 * Gets the list of bike rack resources
 */
app.get(BIKERACK_LIST, (req, res) => {
    let keys = Object.keys(bikeRacks);
    let response = [];
    for (let key of keys) {
        response.push(bikeRacks[key].uri);
    }
    res.send(response);
    // TODO: implement
});

/**
 * Start the Express Server
 */
app.listen(PORT,  async () => {
    console.log(`Go to: http://localhost:${ PORT }` );
    const fileReader: FileReader = new FileReader();
    bikeRacks = await fileReader.loadAllData();
    console.log("printing data" + JSON.stringify(bikeRacks));
});
