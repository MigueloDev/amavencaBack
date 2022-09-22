require('dotenv').config()

const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();
const api = require('./api')

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.json());

app.use(express.urlencoded({ extended : false}));

app.get("/api", (req, res) => {
  //debe retornar el build de react
  res.json({message : "connected to server"})
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.use('/api', api)


