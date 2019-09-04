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

// Returns the post object with the specified id
server.get('/api/posts/:id', (req,res) => {
    const id = req.params.id;
    db.findById(id)
    .then((response) => {
        if (response.length >0){
            res.status(200).json(response)
        }
        else {
            res.status(404).json({message: "The post with the specified id does not exist"})
        }
    })
    .catch((error) => {
        res.status(500).json({error: "The post information could not be retrieved"})
    })
})

// Updates the post with the specified id using info from request body
// returns modified document
server.put('/api/posts/:id', (req,res) => {
    const id = req.params.id;
    const updatedPost = req.body;
    if(updatedPost.title && updatedPost.contents) {
        db.findById(id)
        .then((response) => {
            if(response.length ===0){
                res.status(404).json({message: "The post with the specified id does not exist"})
            }
        })
        .catch((error) => {
            res.status(500).json({error: "The post could not be modified"})
        })
    }
    else {
        res.status(400).json({errorMessage: "Please provide a title and contents for the post"})
    }
})

// Removes post with specified id and returns deleted object
server.delete('/api/posts/:id', (req,res) => {
    const id = req.params.id;
    db.findById(id)
    .then((response) => {
        if(response.length > 0) {
            res.status(404).json({message: "The post with the specified id does not exist"})
        }
        return response;
    })
    .then((response) => {
        db.remove(id)
        .then(()=> {
            res.status(200).json(response)
        })
        .catch((error) => {
            res.status(500).json({error: "The post could not be removed"})
        })
    })
    .catch((error) => {
        res.status(500).json({message: "There was an error finding that post"})
    })
})


module.exports = server;