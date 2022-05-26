const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const corsConfig = {
    origin: true,
    credentials: true,
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t2can.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('manage-tool').collection('tools');
        const bookingCollection = client.db('manage-tool').collection('booked');

        //get tools api
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        // get ObjectId api
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });
        // git post booked api
        app.post('/booked', async (req, res) => {
            const booking = req.body;
            const booked = await bookingCollection.insertOne(booking);
            res.send(booked);

        });
        //get booked api
        app.get('/booked', async (req, res) => {
            const query = {};
            const cursor = bookingCollection.find(query);
            const booked = await cursor.toArray();
            res.send(booked);
        });

        // delete a user
        app.delete('/booked/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const deleted = await bookingCollection.deleteOne(query);
            res.send(deleted);
        });
        // get booked/:id ObjectId api
        app.get('/booked/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const payment = await bookingCollection.findOne(query);
            res.send(payment);
        })

    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello form tools")
})

app.listen(port, () => {
    console.log(`Example applistening on port ${port}`)
})