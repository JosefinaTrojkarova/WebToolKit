import { MongoClient, ServerApiVersion } from 'mongodb';

const mongodbUrl = process.env.MONGODB_URI; // Access the MongoDB URI from the config

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongodbUrl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const connectDB = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

export { connectDB, client };