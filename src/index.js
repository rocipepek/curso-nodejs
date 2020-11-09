const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//habilitar la lectura de variables de entorno
dotenv.config();

const routesV1 = require('./routes/v1');

const app = express();

//app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

routesV1(app);

const { PORT } = process.env || 3000;

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB Error', error);
  });
