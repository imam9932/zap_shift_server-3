const express = require('express')
const app = express()
const cors = require('cors');
const dns = require('dns');

//  change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"])


require('dotenv').config();

// ✅ middleware 
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;



const uri = "mongodb+srv://new_zap_shift_DB:djLzjUkM19OxDMJW@cluster0.msoxyyg.mongodb.net/?appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('zap_shift_db_3');
    const parcelsCollection = db.collection('parcels');

    // parcel api
    app.get('/parcels', async (req, res) => {
      const query = {};
      const { email } = req.query;
      // parcels? email="" &
      if (email) {
        query.senderEmail = email;
      }

      const options={sort : {createdAt:-1}}
      const cursor = parcelsCollection.find(query,options);
      const result = await cursor.toArray();
      res.send(result);

    });

    app.post('/parcels', async (req, res) => {
      const parcel = req.body;
      // parcel created time
      parcel.createdAt = new Date();
      const result = await parcelsCollection.insertOne(parcel)
      res.send(result)
    });

    app.delete('/parcels/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await parcelsCollection.deleteOne(query);
      res.send(result);
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



// /middleware
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Zap is shifting shifting')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
