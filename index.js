const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xxko.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const BooksCollection = client.db("BookCorner").collection("BooksCollection");
 
  app.post('/addBook', (req, res) => {
    const newBooks = req.body;
    BooksCollection.insertOne(newBooks)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
})

app.get('/books', (req,res)=>{
  BooksCollection.find()
  .toArray((err,items)=>{
      res.send(items);
      console.log(" Get data from Database", items);
  })
})

// read to UI
app.get('/products', (req, res) => {
  BooksCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})
app.delete('/delete/:id', (req, res) => {
  BooksCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
      .then(result => {
         res.send(result.deletedCount > 0);
      })
})




  console.log("Database Connected");
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(3001)