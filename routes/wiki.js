const express = require('express');

const router = express.Router();
module.exports = router;
const models = require('../models');

const { Page } = models;
const { User } = models;

router.post('/', (req, res, next) => {
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email,
    },
  })
    .then((values) => {
      const user = values[0];
      const page = Page.build({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        tags: req.body.tags.split(','),
      });
      return page.save().then(page => page.setAuthor(user));
    })
    .then((page) => {
      res.redirect(page.route);
    })
    .catch(next);
});

router.get('/', (req, res, next) => {
  Page.findAll()
    .then((pages) => {
      res.render('index', {
        pages,
      });
    });
});

router.get('/add', (req, res, next) => {
  res.render('addpage');
});

router.get('/search', (req, res, next) => {
  if (req.query.q) {
    Page.findAll({
      where: {
        tags: {
          $overlap: [req.query.q],
        },
      },
    }).then((pages) => {
      console.log(pages);
      res.render('search', {
        pages,
      });
    });
  } else {
    res.render('search');
  }
});

router.get('/search', (req, res, next) => {
  console.log(req.query.q);
});

router.get('/:urlTitle', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
    include: [
      { model: User, as: 'author' },
    ],
  })
    .then((page) => {
      console.log(page.tags);
      if (page === null) {
        res.status(404).send();
      } else {
        res.render('wikipage', {
          urlTitle: page.urlTitle,
          title: page.title,
          authorName: page.author.name,
          authorId: page.author.id,
          tags: page.tags,
          content: page.content,
        });
      }
    })
    .catch(next);
});


router.use('/users', require('./users'));
