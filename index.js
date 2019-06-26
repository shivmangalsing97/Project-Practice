const MongoClient = require('mongodb').MongoClient ;
const express = require('express');
const app = express();
const PORT = 4001;

const url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db) {
    if (err) throw err;
    var dbo = db.db('mydb');

    app.get('/users', (req,res)=>{
        const query = {name : 'shiv' }
        dbo.collection('User').find(query).toArray(function(err, result) {
            if (err) throw err;
           console.log(result);
           res.status(201).send(result)
         });
    })

});

app.listen(PORT,() =>{
    console.log(`Server is serving on port :- ${PORT}`)
});