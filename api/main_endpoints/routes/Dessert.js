const express = require('express');
const router = express.Router();
const Dessert = require('../models/Dessert');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;
const {
  OFFICER
} = require('../../util/constants').MEMBERSHIP_STATE;
const { decodeToken } = require('../util/token-functions');
const User = require('../models/User.js');

async function verifyDessertAccess(req, res, next) {
  const decoded = await decodeToken(req, OFFICER);

  if (!decoded || decoded.status === FORBIDDEN) {
    return res.sendStatus(FORBIDDEN); // 403
  }

  if (decoded.status !== OK) {
    return res.sendStatus(UNAUTHORIZED); // 401
  }

  req.user = decoded.token;

  next();
}

router.get('/getDesserts', (req, res) => {
  Dessert.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/createDessert', verifyDessertAccess, (req, res) => {
  const { rating } = req.body;
  const numberSent = !Number.isNaN(Number(rating));

  const newEvent = new Dessert({
    title: req.body.title,
    description: req.body.description,
    rating: numberSent ? Number(rating) : undefined,
  });

  Dessert.create(newEvent, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    } else {
      return res.json(post);
    }
  });
});

router.post('/editDessert', verifyDessertAccess, (req, res) => {
  const {
    title,
    description,
    rating,
    _id,
  } = req.body;
  Dessert.findOne({ _id })
    .then(Dessert => {
      Dessert.title = title || Dessert.title;
      Dessert.description = description || Dessert.description;
      Dessert.rating = rating || Dessert.rating;
     Dessert 
        .save()
        .then(() => {
          res.sendStatus(OK);
        })
        .catch(() => {
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch(() => {
      res.sendStatus(NOT_FOUND);
    });
});

router.post('/deleteDessert', verifyDessertAccess, (req, res) => {
  Dessert.deleteOne({ _id: req.body._id })
    .then(result => {
      if (result.n < 1) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(OK);
      }
    })
    .catch(() => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;

/*
const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 502,
};
*/