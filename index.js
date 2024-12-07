//import
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//initialization
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@inochi.zmivthc.mongodb.net/?retryWrites=true&w=majority&appName=Inochi`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        
        const countriesCollection = client.db('questDB').collection('countries')
        const touristCollection = client.db('questDB').collection('tourist_spots')

        app.get('/countries', async (req, res) => {
            const result = await countriesCollection.find().toArray()
            res.send(result)
        })

        app.get('/tourist_spots', async (req, res) => {
            const result = await touristCollection.find().toArray()
            res.send(result)
        })

        app.get('/tourist_spots/:email', async (req, res) => {
            const email = req.params.email
            const query = { user_email: email}
            const result = await touristCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/tourist_spots/country/:country', async (req, res) => {
            const country = req.params.country
            const query = { country_name: country}
            const result = await touristCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/tourist_spots/spot/:_id', async (req, res) => {
            const id = req.params._id
            const query = { _id: new ObjectId(id)}
            const result = await touristCollection.findOne(query)
            res.send(result)
        })

        app.delete('/tourist_spots/spot/:_id', async (req, res) => {
            const id = req.params._id
            const query = { _id: new ObjectId(id)}
            const result = await touristCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/tourist_spots/spot/:_id', async (req, res) => {
            const id = req.params._id
            const tourist = req.body
            const query = { _id: new ObjectId(id)}
            const touristUpdate = {
                $set: {
                    tourist_spot_name: tourist.tourist_spot_name,
                    image: tourist.image,
                    country_name: tourist.country_name,
                    location: tourist.location,
                    description: tourist.description,
                    cost: tourist.cost,
                    seasonality: tourist.seasonality,
                    travel_time: tourist.travel_time,
                    visitors_per_year: tourist.visitors_per_year
                }
            }
            const result = await touristCollection.updateOne(query, touristUpdate)
            res.send(result)
        })

        app.post('/tourist_spots', async (req, res) => {
            const touristAdd = req.body
            console.log(touristAdd)
            const result = await touristCollection.insertOne(touristAdd);
            res.send(result)
        })

        app.get('/tourist_spots/cost_ascending/true', async (req, res) => {
            const result = await touristCollection.find().sort({ cost: 1 }).toArray()
            res.send(result)
        })

        app.get('/tourist_spots/cost_descending/true', async (req, res) => {
            const result = await touristCollection.find().sort({ cost: -1 }).toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Quest Tourism Running')
})

app.listen(port, () => {
    console.log('quest tourism server is running on port: ', port)
})

module.exports = app;