const express = require('express');

const router = express.Router();
module.exports = router;
const models = require('../models');

const { Page } = models;
const { User } = models;

router.get('/', (req, res, next) => {
  User.findAll({})
    .then((users) => {
      res.render('users', { users });
    }).catch(next);
});

router.get('/:userId', (req, res, next) => {
  const userPromise = User.findById(req.params.userId);
  const pagesPromise = Page.findAll({
    where: {
      authorId: req.params.userId,
    },
  });

  Promise.all([
    userPromise,
    pagesPromise,
  ])
    .then((values) => {
      const user = values[0];
      const pages = values[1];
      res.render('user', { user, pages });
    })
    .catch(next);
});
