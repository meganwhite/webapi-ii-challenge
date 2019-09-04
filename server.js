const db = require('./data/db');
const express = require('express');

const server = express();
server.use(express.json());

server.get('/', (req,res) => {
    req.status(200).json({api:"up..."});
});

// Returns an array of all the post objects contained in the database.
server.get('/api/posts', (req,res) => {
    db.find()
    .then((posts) => {
        res.status(200).json(posts)
    })
    .catch((error) => {
        res.status(500).json({error: "The posts information could not be retrieved"})
    })
})

// Creates a post using information sent inside request body
// returns id object
server.post('/api/posts', (req,res) => {
    const newPost = req.body;
    const {title,contents} = req.body;
    if (title && contents) {
        db.insert(newPost)
        .then((idObj) => {
            db.findById(idObj.id)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(res.status(500).json({message: "Error getting new post"}))
        })
        .catch((error) => {
            res.status(500).json({error: "There was an error while saving post to database"})
        })
    }
    else {
        res.status(400).json({errorMessage: "Please provide the title and contents of the post"})
    }
})

module.exports = server;