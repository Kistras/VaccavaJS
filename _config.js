const {readfile, writefile} = require('./_file.js')
let defaultConfig
var config = {}

function getfield(datafile, field) {
    if (field)
        if (field in config[datafile])
            return config[datafile][field]
        else
            if (field in defaultConfig)
                return defaultConfig[field]
            else 
                return null
    else
        return config[datafile]
}

function getconfig(datafile, field, funcresponse) {
    if (!(datafile in config)) {
        readfile(`./data/${datafile}.json`,
            function(data) {
                try {
                    config[datafile] = JSON.parse(data)
                } catch(err) {
                    console.log(`Error while decoding JSON from ./data/${datafile}.json`)
                    console.log(err)
                }
                funcresponse(getfield(datafile, field))
            },
            function(err) {
                config[datafile] = defaultConfig
                funcresponse(getfield(datafile, field))
            }
        )
    } else
        funcresponse(getfield(datafile, field))
}
module.exports.getconfig = getconfig

function editconfig(datafile, field, data, responsefunc) {
    // Prevent editing Defalut config
    if (datafile === 'Default') return
    // Use getconfig to automatically load config
    getconfig(datafile, null, function(dt){
        config[datafile][field] = data
        writefile(`./data/${datafile}.json`, JSON.stringify(config[datafile]), function(err) {
            if (err) {
                console.log(`Error while saving JSON to ./data/${datafile}.json`)
                console.log(err)
            }
            if (responsefunc)
                responsefunc(err)
        })
    }) 
}
module.exports.editconfig = editconfig

// Load default config... by default
if(!defaultConfig){
    getconfig('Default', null, function(conf) {
        defaultConfig = conf
        console.log(conf)
        console.log('Default config initalized.')
        module.exports.defaultConfig = conf
    })
}
