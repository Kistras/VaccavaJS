const fs = require('fs')

function doimport(moduleFolder){
    var modules = {}

    fs.readdirSync(moduleFolder).forEach(file => {
        if(file.includes('.js')){
            modules[file.split('.js')[0]] = require(moduleFolder + file)
        }
    })

    return modules
}

module.exports = {
    import: doimport
}
