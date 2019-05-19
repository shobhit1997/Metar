
Metar
===================================

## Assumptions
1. Redis server is setup
2. Node and npm is installed
3. System is connected to the internet
4. Port 3000 is empty

## Install
1. Extract the file
2. Run the following instruction
```
$ npm install
$ npm start
```

## Usage

1. Open a new tab in the browser and hit localhost:3000/metar/info?scode=KHUL
2. Reload the tab to see the result from redis
3. Open a new tab and hit localhost:3000/metar/info?scode=KHUL&nocache=1
4. Open a new tab and hit localhost:3000/metar/ping