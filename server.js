const express = require('express')
var bodyParser = require('body-parser')
var mysql = require('mysql');

const app = express()
const port = 5500

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'real_estate_data'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    app.post('/api/estimate', (req, res) => {
        let {sqft, zip, beds, baths} = req.body;

        var sql = `SELECT * FROM house_data ${(zip || beds || baths) ? ' WHERE ' : ''} ${zip ? ('zip = ' + zip) : ''}` +
         `${(beds && zip) ? ' AND ' : ''}` +
         `${beds ? ('beds = ' + beds) : ''}` +
         `${((beds && baths) || (baths && zip)) ? ' AND ' : ''}` +
         `${baths ? ('baths = ' + baths) : ''}`
        con.query(sql, function(err, result) {
            if (err) throw err;
            let estimated_price = 0;
            if (result.length < 1) {
                res.send({error: "There is not enough info in the db to make an accurate prediction!"});
                return;
            }
            let hcount = 0;
            result.forEach((h) => {
                if (!sqft || !h.sqft) {
                    estimated_price += (parseInt(h.price));
                    hcount++;
                } else {
                    if (((parseInt(sqft) + 200) > parseInt(h.sqft)) && ((parseInt(sqft) - 200) < parseInt(h.sqft))) {
                        estimated_price += (parseInt(h.price))
                        hcount++;
                    }
                }
            });

            estimated_price = estimated_price / hcount;

            res.send({price: estimated_price});
        });
    });

    app.post('/api/correction', (req, res) => {
        let body = req.body;
        var sql = `INSERT INTO house_data (price, zip, beds, baths, sqft) VALUES (${body.price}, ${body.zip ? "'" : ""}${body.zip ? body.zip : 'NULL'}${body.zip ? "'" : ""}, ${body.beds ? body.beds : 'NULL'}, ${body.baths ? body.baths : 'NULL'}, ${body.sqft ? body.sqft : 'NULL'})`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send({message: "Thanks for your feedback!"});
        });
    });

    app.get('/', (req, res) => {
        res.sendFile('index.html')
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
