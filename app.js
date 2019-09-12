const request = require('request')
const yargs = require('yargs')

const url = 'https://api.darksky.net/forecast/your_key/37.8267,-122.4233?units=us'
let address

request({ url: url, json: true }, (error, response) => {
    //const data = JSON.parse(response.body) //setting json to true automatically 
    //parses the json and no need to include this line
    //console.log(response.body.currently)
    if(error) {
        console.log('Unable to connect to weather service')
    } else if(response.body.error) {
        console.log('Unable to find location')
    } else {
        console.log(response.body.daily.data[0].summary + ' It is currently ' + 
    response.body.currently.temperature + ' degrees out. There is a ' + 
    response.body.currently.precipProbability + '% chance of rain.')
    } 
})

const geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=your_key&limit=1'

request({url: geocodeURL, json: true}, (error, response) => {
    //console.log(response.body.features[0].center)
    if(error) {
        console.log('Unable to connect to location services!')
    } else if(response.body.features.length === 0) {
        console.log('Unable to find location. Try another search.')
    } else {
        const latitude = response.body.features[0].center[1]
        const longitude = response.body.features[0].center[0]
        console.log(latitude, longitude)  
    }
})

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=your_key&limit=1'

    request({ url: url, json: true }, (error, response) => {
        if(error) {
            callback('Unable to connect to location services!', undefined)
        } else if(response.body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}

geocode('New York', (error, data) => {  //defining callback the way most libraries define it (1st arg: error, 2nd: data)
    console.log('Error', error)
    console.log('Data', data)
})


// yargs.command({
//     command: 'address',
//     describe: 'Enter an address',
//     builder: {
//         addr: {
//             describe: 'Address',
//             demandOption: true,
//             type: 'string'
//         }
//     },
//     handler(argv) {
//         console.log(yargs.argv)
//         address = argv.addr
//         console.log(address)
//     }
// })

// //console.log(yargs.argv)
// //Geocoding is a process of taking an address like Arizona united states and converting it 
// //into latitude and longitude coordinate pair
// yargs.argv
