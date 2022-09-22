require('dotenv').config()

const PORT = process.env.PORT || 3001;
const express = require('express');
const app  = express();
const api  = require('./api');
const path = require('path');

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.json());

app.use(express.urlencoded({ extended : false}));

app.get("/api", (req, res) => {
  //debe retornar el build de react
  res.json({message : "connected to server"})
})
app.use('/api', api)

// All other GET requests not handled before will return our React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
}); */



