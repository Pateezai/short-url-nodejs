const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const randomstring = require('randomstring');
const { json } = require('express');

const MongoClient = require('mongodb').MongoClient;
const MONGO_DB = "mongodb+srv://admin:admin@cluster0.cfjrqh5.mongodb.net/?retryWrites=true&w=majority"
app.use(express.json())
app.use(express.static(__dirname ));
// app.use(bodyParser.json());



let database;
let client;
//function for database connection 
async function dbconnection() {
  try {

    client = new MongoClient(MONGO_DB);

    // Connect the client to the server
    await client.connect();
    //define role 
    database = client.db("url_db");
    //log for check connection
    console.log("Connected successfully to server");
    // return urldb;
    } catch {
        //raise error if error
        console.error(error);
    }
//   finally {
//     console.log('close now')
//     // close client (make sure) when you finish/error
//     await client.close();
//   }
}
dbconnection().catch(console.dir);

//sent data to the database 
app.post('/', async (req, res) => {
    const { og_url } = req.body;
    let custom_url = req.body['custom_url'];
    console.log('tests'+ custom_url)
    console.log('tests'+ typeof custom_url)
    console.log('tests'+ custom_url.length)
    if(custom_url.length === 0){
        custom_url = randomstring.generate(8);
    }
    const final_url = req.protocol + '://' + req.headers.host + '/' + custom_url;

    //window.location.origin
    let collect = { og_url, custom_url, final_url };
    // let collect = { og_url };
    const existing = await database.collection('urls').findOne({ custom_url })
    if (existing) {
        console.log('existinggggg')
        return res.status(400).json({ error: 'custom_url already exists' });
    }
    await database.collection('urls').insertOne(collect);
    res.send(collect);
    console.log(collect);

});





//redirect to real url 
//check data in collections
app.get('/api', (req, res) => {
    database.collection('urls').find({}).toArray((err, client) => {
        if(err) throw err
        res.json(client); 
    })
})

app.get('/:message', async (req, res) => {
    const custom_url = req.params.message;
    const result = await database.collection('urls').findOne({ custom_url });
    if(result) {
        
        //now if put only www.example.com its will error its should be http:// or https:// like https://www.example.com this will work
        //so we have to write the function to fix this issue 
        //example code
        //const og_url = `http://${req.body.og_url}`;
        //const og_url = `https://${req.body.og_url}`;
        //it's would be better if create function to catch this error in app.js
        res.redirect(result.og_url);

    } else {
        res.status(404).send("URL not found")
    }

})




    

app.listen(8000, () => {
    console.log('Server started on port 8000');
});