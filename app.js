/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const enrouten = require('express-enrouten');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./routes/route')

const app = express();
const config = require('./config.js');
const setAssociations = require('./database/models/association.js');

setAssociations();

const port = config.get('PORT');

app.use(cors({origin: '*'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  return next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(enrouten({
  directory: path.join(__dirname, 'controllers'),
}));

app.use('*', async (req, res) => res.status(404).json({ message: 'Resource not found. '}));

app.use(async (err, req, res, next) => {
  const message = err.message || 'Internal server error.';
  const data = err.error;
  return res.status(500).json({ message, data });
});

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));app.use("/api_v1",route(express));
// app.listen(3000, () => {
//     console.log('Success running 3000');
// });


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});




module.exports = app;