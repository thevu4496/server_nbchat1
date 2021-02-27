const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const app = express();
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path');
const path = require('path');
const { isBuffer } = require('util');
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)
// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());
var port = (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 6969);
// file upload api
app.post('/uploads', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    var dir = __dirname + '/public';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let url = req.protocol + '://' + req.get('host');
    let len = req.files.files.length;
    if(len){
        let respon = [];
        req.files.files.forEach(myFile => {
            let d = new Date();
            let n = d.getTime();
            let name = n + myFile.name;
            myFile.mv(`${__dirname}/public/${name}`, function (err) {
                if (err) {
                    respon.push({error : 1 , name: myFile.name , msg: err });
                }
                else{
                    respon.push({success : 1 , name: myFile.name, path: `${url}/app/public/${name}`});
                }
                if(respon.length == len){
                    return res.send(respon);
                }
            });
        });
    }
    else{
        let d = new Date();
        let n = d.getTime();
        const myFile = req.files.files;
        let name = n + myFile.name;
        myFile.mv(`${__dirname}/public/${name}`, function (err) {
            if (err) {
                return res.status(500).send({error : 1 , name: myFile.name , msg: err });
            }
            return res.send({name: myFile.name, path: `${url}/app/public/${name}`});
        });
    }
})
app.get('/aa', (req,res) => {
    let f = getDirectories(__dirname);
    for(let i in f){
        if(typeof f[i] == "string"){
            res.write(f[i]+"\n");
        }
    }
    console.log("Ccc");
    fs.readdir('./public/', (err, files) => {
        files.forEach(file => {
            res.write(file);
        });
        res.end();
      });
    
});
app.get('/app/public/:id', (req,res) => {
    let im = req.params.id;
    res.sendFile(path.join(__dirname, "./public/" + im));
});
app.listen(port, () => {
    console.log('server is running at port 4500');
})