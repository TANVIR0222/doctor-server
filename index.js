const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.htwfwrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const infoCllection = client.db('Doctor').collection('info');
    const cardInfoCllection = client.db('Doctor').collection('doctorInfo');
    const contactCollection = client.db('Doctor').collection('contact');

    // get data 
    app.get("/info" , async(req,res)=>{
        const result = await infoCllection.find().toArray();
        res.send(result);
    })

    // get card data 
    app.get("/doctorInfo" , async(req,res)=>{
        const result = await cardInfoCllection.find().toArray();
        res.send(result);
    })
    // fined one data 
    app.get('/doctorInfo/:id' , async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id) }
        const options = {
            projection: {  first_name : 1 , image_url: 1, location: 1 , specialty: 1,  rating: 1 , academic_status: 1},
        };
        const result = await cardInfoCllection.findOne(query);
        res.send(result);
    })

    // insert data 
    app.post("/contact" , async(req,res) =>{
      const user = req.body;
      const result = await contactCollection.insertOne(user);
      res.send(result);
      console.log(user);
    })

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req , res)=>{
    res.send('server is runing')
})

app.listen(port , (req, res)=>{
    console.log(`server is running ${port}`);
})

//Doctor
//HPaLE1XyEAsXZBt2