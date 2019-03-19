/**
 * *********************
 * A Bike Data Manager
 * *********************
 * Get all the data from the lock-my-bike server
 * Provide interface for getting the necessary data
 */
export default class BikeDataManager {
    // TODO

    /**
     * Get list of URIs
     * @returns {Promise<*>}
     */
    async getListOfBikeRacks() {
        let arrayAsString = await this._getHttp("http://localhost:3000/bike-racks");
        // console.log(arrayAsString);
        return arrayAsString;
    }

    /**
     * Returns all the bike rack objects
     * @return any[]: list of bike racks
     */
    async getAllBikeRackObjects(listOfUris) {
        // let uriList: any[] = [];
        // TODO: implement
        //Initialize array of bike rack objects
        let returnArray = [];
        for (let uri of listOfUris) {
            let objectAsString = await this._getHttp(uri);
            returnArray.push(objectAsString);
        }
        return returnArray;
    }

    /**
     * Make a GET request
     * @param url
     * @returns {Promise<*> | Promise<*>}
     * @private
     */
    _getHttp(url: string): Promise<any> {
        return new Promise((resolve,reject) => {
            fetch(url)
                .then((response) => {
                    resolve( response.json() );
                })
                .catch((err) => {
                    reject (err);
                })
        });
    }
}