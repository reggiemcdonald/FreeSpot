# FreeSpot
Find the nearest unoccupied bike rack.

FreeSpot is a react-native iOS application that maps bike racks and the number of free spots currently available. The app relies on a NodeJS server that is updated in real-time by a Arduino-powered ultrasonic sensor at the bike rack.

To build this project:
- `git clone`
### Build the server
- `cd server`
- Insert your own Google Maps API key into cred/keys.ts
- `yarn install`
- `yarn start`
### If you dont have a networked arduino, build the demo server
- `cd ../sensor`
- `yarn install`
- `yarn start`

### Run the mobile application
- `cd ../client`
- `yarn install`
- `react-native run-ios --simulator=<Target iPhone>`

#### Unified build script coming soon
