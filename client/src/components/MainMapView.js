import React from "react";
import MapView from "react-native-maps";
import BikeDataManager from "../library/BikeDataManager";
import {Marker} from "react-native-maps";
import TimerMixin from "react-timer-mixin";
mixins:[TimerMixin];
export default class MainMapView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data: []
        };
    }

    render() {
        if (this.state.data.length === 0) {
            return (
                <MapView
                    style={{flex: 1}}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    region={
                        {
                            latitude: 49.261284,
                            longitude: -123.248773,
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03
                        }
                    }
                />
            )
        } else {
            return (
                <MapView
                    style={{flex: 1}}
                    region={
                        {
                            latitude: 49.261284,
                            longitude: -123.248773,
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03
                        }
                    }
                    followsUserLocation={true}
                    showsUserLocation={true}
                >
                    {this._renderMarkers()}
                </MapView>
            )
        }

    }

    async componentDidMount() {
        this.interval = setInterval(async () => {
            let dataManager = new BikeDataManager();
            let uris = await dataManager.getListOfBikeRacks();
            let bikeRacks = await dataManager.getAllBikeRackObjects(uris);
            console.log(bikeRacks);
            this.setState({
                data: bikeRacks
            });
        }, 3000);
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
    }


    _renderMarkers() {
        return this.state.data.map((marker) => {
            return (<Marker
                coordinate={{
                    latitude: marker.coordinates.lat,
                    longitude: marker.coordinates.lng
                }}
                title={marker.address}
                description={this._formatCapacity(marker.capacity, marker.available)}
                pinColor={marker.available > 0 ? "#33cc33" : "#ff0000"}
                key={marker.id}
            />
            )
        });
    }

    _formatCapacity (capacity, available) {
        return "Spots available: " + available.toString() + "/" + capacity.toString();
    }
}