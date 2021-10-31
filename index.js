const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ns6st.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {
    try {
      await client.connect();
      console.log("connect to database for confirs message")
      const serviceCollection =  client.db("traveAgency").collection("services");
     
      const orderCollection  =  client.db("traveAgency").collection("orders");

       //post api
      app.post("/addServices",(req, res)=>{
        serviceCollection.insertOne(req.body).then(result=>{
            // console.log(result)
          res.send(result.insertedId);
        })
      })

      // Add order Api

      app.post("/orders",(req, res)=>{
        orderCollection.insertOne(req.body).then(result=>{
            // console.log(result)
          res.send(result.insertedId);
        })
      })

         //get api

         app.get("/services",async(req,res)=>{
          const result = await serviceCollection.find({}).toArray();
          res.send(result);
        });

        //get order api

        app.get("/orders",async(req,res)=>{
          const result = await orderCollection.find({}).toArray();
          res.send(result);
        });

        // //get Single Service

        app.get('/services/:id',async(req,res)=>{
           const id = req.params.id;
          //  console.log(id)
           const query = {_id: ObjectId(id)};
          const service = await serviceCollection.findOne(query);
          res.json(service);
         })

       //delet service
       app.delete("/deleteOrders/:id",async(req,res)=>{
          
        console.log(req.params.id)

        const result = await orderCollection.deleteOne({_id:ObjectId(req.params.id),})
        // console.log(result);
        res.send(result)
      });


      }
      

    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})