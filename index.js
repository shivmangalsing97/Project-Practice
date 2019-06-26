const MongoClient = require('mongodb').MongoClient;
const url = require('url');
const express = require('express');
const app = express();
const PORT = 4001;

const mongoUrl = "mongodb://localhost:27017/";

MongoClient.connect(mongoUrl , { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mydb');

    //Read all users
    app.get('/users', (req, res) => {
        dbo.collection('User').find({}).toArray(function (err, result) {
            if (err) throw err;
            res.status(201).send(result)
        });
    });
    //Read singlr user
    app.get('/users/:name', (req,res)=>{
        dbo.collection('User').find({}).toArray(function (err, result) {
            const foundUser = result.find( user => {
                return user.name === req.params.name 
            })
            if(foundUser){
                res.status(201).send(foundUser);
            } else {
                res.status(404).send()
            }
        });
    });

    //Create new User
    app.post('/create', (req, res) => {
        const myobj = url.parse(req.url, true).query;
        dbo.collection('User').insertOne(myobj, function (err) { 
            return res.send("Created Successfully");
        });
    })

    //Update Any User
    app.put('/update/:name', (req, res, next) => {
        const myQuery = {name : req.params.name};
        const queryObject = url.parse(req.url, true).query;
        const newValue = { $set : queryObject}
        dbo.collection('User').find({}).toArray(function (err, result) {
            const foundUser = result.find( user => {
                return user.name === req.params.name 
            })
            if(foundUser){
                dbo.collection('User').updateOne(myQuery, newValue, function(err) {
                    if (err) throw err ; 
                    return res.status(201).send("Updated Successfully");         
                });
            } else {
                res.status(404).send('Not Found')
            }
        });
    });

    //Delete user
    app.delete('/delete/:name', (req,res)=>{
        const delobj = {name : req.params.name}
        dbo.collection('User').find({}).toArray((err, result)=>{
            const foundUser =result.find( user => {
                return user.name === req.params.name ;
            });
            if(foundUser){
                dbo.collection('User').deleteOne(delobj, (err) =>{
                    if(err) throw err;
                });
                res.status(201).send('Deleted Successfully');
            } else {
                res.status(404).send('Not Found')
            }
        })
    })

});

app.listen(PORT, () => {
    console.log(`Server is serving on port :- ${PORT}`)
});