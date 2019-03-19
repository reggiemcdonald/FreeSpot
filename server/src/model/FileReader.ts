import parse from "csv-parse";
import fs from "fs";
import https from "https";
import API_KEY from "../../cred/keys";

export default class FileReader {
    private path: any = "./src/data/BikeRackData.csv";
    private requestStub: string = "https://maps.googleapis.com/maps/api/geocode/json?";
    private readonly uriStart: string = "http://localhost:3000";
    private readonly uriEndPoint: string = "bike-racks";

// Create the parser

    public async loadAllData(): Promise<any> {
        // TODO
        try {
            const data: string = this.readCSV(this.path);
            // console.log(data);
            const bikeRacks: any = await this.CSVtoJSON(data);
            return bikeRacks;
        } catch (err) {
            throw err;
        }
    }

    public readCSV(path: string): string {
        return fs.readFileSync(path, {encoding: "utf8"});
    }

    public CSVtoJSON(file: string): any {
        return new Promise((resolve, reject) => {
            const parser = parse(file, {
                delimiter: ","
            });

            parser.on("readable", async () => {
                let record: any;
                let bikeRacks: any = {};
                let count: number = 0;
                record = parser.read();
                try {
                    while (record) {
                        if (record != null) {
                            console.log("save to output before");
                            const obj = await this.saveToOutput(record, count.toString());
                            bikeRacks[count.toString()] = obj;
                            count++;
                        }
                        record = parser.read();
                        // Catch any error
                        parser.on("error", (err) => {
                            console.error(err.message + "this is an error");

                        });
                    }
                    resolve(bikeRacks);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    private async saveToOutput(record: any, count: string): Promise<any> {
        try {
            const address0: string = record[0] + " " + record[1] + " " + record[2] + " " + record[3];
            let coords: any = await this.getGeoCode(address0);
            if (coords.results[0] !== undefined) {
                coords = coords.results[0].geometry.location;
                const obj: any = {
                    id: count,
                    address: address0,
                    sideOfStreet: record [4],
                    capacity: record[5],
                    available: record[5],
                    coordinates: coords,
                    uri: this.uriStart + "/" + this.uriEndPoint + "/" + count
                };

                // this.getGeoCode(obj.address); // pass this into geocode
                return obj;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    private async getGeoCode(address: any): Promise<any> {
        console.log("inside getGeoCode");
        address = address.split(" ").join("+"); // encodeURIComponent(address.trim());
        const request: string = this.requestStub + "address=" + address + "&key=" + API_KEY;
        // console.log(request);
        return await this.getCoordinates(request);

    }

    private getCoordinates(url: string): Promise<any> {
        console.log("url ", url);
        return new Promise(async (resolve, reject) => {
            await https.get(url, (response: any) => {
                let responseString: string = "";
                response.on("data", (data: any) => {
                    responseString += data;
                });
                response.on("end", () => {
                    // console.log("***" + response);
                    // console.log(JSON.parse(responseString));
                    // JSON.parse(responseString);
                    resolve(JSON.parse(responseString));
                });
            }).on("error", (err) => {
                console.log("error occured in HTML GET", err);
                reject("There was an error");
            });
        });
    }
}
