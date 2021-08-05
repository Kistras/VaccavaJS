const fs = require('fs')
const path = require('path')

function readfile(relpath, funcsuccess, funcerror){
    fs.readFile(path.join(__dirname, relpath), {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            if (funcsuccess)
                funcsuccess(data)
        } else {
            if (funcserror)
                funcerror(err)
        }
    });
}
module.exports.readfile = readfile
