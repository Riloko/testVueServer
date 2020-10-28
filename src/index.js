const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const products = require('./products.json');

const whitelist = ['http://localhost:8000', 'http://localhost:8080']; //white list consumers
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

require('dotenv').config();

const middlewares = require('./middlewares/errorHandling');

const app = express(), port = process.env.PORT || 1337;

app.use(morgan('common'));
app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());

app.get('/get_products', (req, res) => {
    res.json({"status": 'success',"products": products})
});
app.use('/create_order', (req, res) => {
    console.log(req.body)
    res.json({"status": 'success'})
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});