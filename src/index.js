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
  res.json({"status": 'success',"products": products.sort((a,b) => a.id - b.id)})
});

app.get('/get_products/filter/price_down', (req, res) => {
  res.json({"status": 'success', "products": products.sort((a, b) => {
      let aPrice = 0;
      let bPrice = 0;
      a.sale ? aPrice = Math.floor(a.price * 0.85) : aPrice = a.price;
      b.sale ? bPrice = Math.floor(b.price * 0.85) : bPrice = b.price;

      return aPrice - bPrice;
    })
  })
})

app.get('/get_products/filter/price_up', (req, res) => {
  res.json({"status": 'success', "products": products.sort((a, b) => {
      let aPrice = 0;
      let bPrice = 0;
      a.sale ? aPrice = Math.floor(a.price * 0.85) : aPrice = a.price;
      b.sale ? bPrice = Math.floor(b.price * 0.85) : bPrice = b.price;

      return bPrice - aPrice;
    })
  })
})

app.post('/get_products/filter/search', (req, res) => {
  const payload = req.body.searchString.toLowerCase();
  res.json(
    {"status": 'success', "products": products.filter(({text, size, price, sale}) => {
        return text.toLowerCase().includes(payload) || size.includes(payload) || ((sale ? Math.floor(price * 0.85) : price) == payload)
    })}
  )
})

app.use('/create_order', (req, res) => {
    console.log(req.body)
    res.json({"status": 'success'})
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});