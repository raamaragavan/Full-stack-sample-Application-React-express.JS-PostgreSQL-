import express from "express";
import cors from "cors"

const app = express();
const db = require('./db');
app.use(express.json())
app.use(cors());
app.get('/api/notes',async(req,res) => {
    try {
        const result = await db.query('SELECT * FROM notes');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})
app.post('/api/notes',async(req,res) => {
    const {title,content} = req.body;
    if(!title || !content){
        res.status(400).send('title and content field should not be empty');
    }
    try {
        const insertQuery = "INSERT INTO notes (title, content) VALUES ('"+title+"','"+content+"');";
        await db.query(insertQuery);
        res.status(200).send('successfully created');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})
app.put('/api/notes/:id',async(req,res) => {
    const id = parseInt(req.params.id);
    if(!id || isNaN(id)){
        res.status(400).send('ID not exist or Invalid ID');
    }
    try {
        const {title,content} = req.body;
        const updateQuery = "UPDATE notes SET title ='"+ title+"', content ='"+ content+"'WHERE id="+id;
        await db.query(updateQuery);
        res.status(200).send('successfully updated');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})

app.delete('/api/notes/:id',async(req,res) => {
    const id = parseInt(req.params.id);
    if(!id || isNaN(id)){
        res.status(400).send('ID not exist or Invalid ID');
    }
    try {
        const deleteQuery = "DELETE FROM notes WHERE id =" +id;
        await db.query(deleteQuery);
        res.status(200).send('successfully deleted');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})


app.get('/api/note/:id',async(req,res) => {
    const id = parseInt(req.params.id);
    if(!id || isNaN(id)){
        res.status(400).send('ID not exist or Invalid ID');
    }
    try {
        const getQuery = "SELECT * FROM notes WHERE id="+id;
        const result  = await db.query(getQuery);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
})


app.listen(5000,() => {
    console.log('server started running on localhost:5000')
})