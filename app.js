const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api',verifyToken, (req, res) => {
    jwt.verify(req.token, 'iamasecretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'welcome to JWT'
            });
        }
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'iamasecretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: '......post created',
                authData :authData
            });
        }
    })

});

app.post('/api/login', (req, res) => {
    //Mock User
    const user = {
        id: 1,
        username: 'shiv',
        email: 'shiv@gmail.com'
    }
    jwt.sign({ user : user  }, 'iamasecretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token : token
        })
    });

});

// format of token
// Authorization : Bearer <access_token>

//Verify token function 
function verifyToken(req, res, next) {
    //Get Auth Header Value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is not define
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space   
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token 
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        //forbidden 
        res.sendStatus(403);
    }
}

app.listen(4000, () => {
    console.log('server satarted on 4000')
})