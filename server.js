const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();
// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());
// file upload api
app.post('/uploads', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
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
                respon.push({success : 1 , name: myFile.name, path: `${url}/${name}`});
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
            return res.send({name: myFile.name, path: `${url}/${name}`});
        });
    }
})
app.get('/aa', (req,res) => {
    res.write(a);
    res.end();
});
app.listen(4500, () => {
    console.log('server is running at port 4500');
})