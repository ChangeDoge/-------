require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const fileUpload = require('express-fileupload')
const PORT = process.env.PORT || 5000
const app = express()
var urlencodedParse = bodyParser.urlencoded({ extended: false })

app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')))

//View setup--------------------------------------------
app.set('view engine', 'ejs')
app.use('/static', express.static('public'))

//Reading json files
var fileR = fs.readFileSync('.//json/regions.json', 'utf8')
var jsObjectRegions = JSON.parse(fileR);

var fileWB = fs.readFileSync('.//json/waterbases.json', 'utf8')
var jsObjectWBs = JSON.parse(fileWB)

var fileTest = fs.readFileSync('.//files/data.json', 'utf8')
var jsObjectTest = JSON.parse(fileTest)

//Method for geting and rewriting new data
// Adding new data into data.json
app.post('/add', urlencodedParse, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    console.log(req.body);
    //Reading json-file without "]"
    var jsonData = fs.readFileSync('.//files/data.json', 'utf8');
    //Reading for selector
    var jsonRegion = fs.readFileSync('.//json/regions.json', 'utf8')
    //Rewriting old json-file
    var all = jsonData.substring(0, jsonData.length - 1) + ', '
        + JSON.stringify(req.body) + "]";
    console.log(all);
    //Saving
    fs.writeFileSync('.//files/data.json', all, function (error) {
        if (error) throw error;
        console.log("Async writing succesful.");
    })
    console.log("Заказ успешено оформлен")
    app.post('/upload', function (req, res) {
        req.files.photo.mv(__dirname + '/files/usersPic/' + req.files.photo.name);
        res.end(req.files.photo.name);
        console.log(req.files.photo); // the uploaded file object
    });
    //Redirect to previous page
    res.render('add', { dataR: jsObjectRegions, dataWB: jsObjectWBs })

})
//Page Redirect with data sending------------------------------------------------------------------------------------
app.get('/:name', function (req, res) {
    if (req.params.name === 'add') { res.render('add', { dataR: jsObjectRegions, dataWB: jsObjectWBs }) }
    else if (req.params.name === 'view') { res.render('view', { dataP: jsObjectTest }); }
    else { res.sendFile(__dirname + '/404.html') }
})

//File upload -------------------------------------
app.post('/upload', function (req, res) {
    req.files.photo.mv(__dirname + '/files/usersPic/' + req.files.photo.name);
    console.log(req.files.photo); // the uploaded file object
});

//Server  app.listen(PORT)----------------------------------------------------

app.get('/', function (req, res) {
    res.render('add');
})
//port ping
app.get('/', (req, res) => {
    res.status(200).json({ message: 'WORKING' })

})
//server start---------------------------------

const start = async () => {
    try {
        app.listen(PORT, () => console.log('Server started on port: ' + PORT))
    } catch (e) {
        console.log(e)
    }


}
start()


