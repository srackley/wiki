const express = require("express");
const router = express.Router();
module.exports = router;
var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.post('/', function(req, res, next) {
  User.findOrCreate({
      where: {
          name: req.body.name,
          email: req.body.email
      }
  })
    .then(function (values){
        var user = values[0];
        var page = Page.build({
            title: req.body.title,
            content: req.body.content
      }); 
   return page.save().then(function(page){
        return page.setAuthor(user);
    });
  })
  .then(function(page){
      res.redirect(page.route);
})
.catch(next);
});

router.get('/', function(req, res, next){
   Page.findAll()
   .then(function(pages){
       res.render('index', {
           pages: pages
            });
        });
    });

router.get('/add', function(req, res, next){
    res.render('addpage');
    });

router.get('/:urlTitle', function(req, res, next){
    Page.findOne({
       where: { 
           urlTitle: req.params.urlTitle
       },
       include: [
           {model: User, as: 'author'}
       ] 
    })
    .then(function(page){   
        console.log(page);
        if (page === null){
            res.status(404).send();
        }  else {
        res.render('wikipage', {
            urlTitle: page.urlTitle,
            title: page.title,
            authorName: page.author.name,
            authorId: page.author.id,
            tags: page.tags,
            content: page.content
        });
    }
})
    .catch(next);
});

router.use('/users', require('./users'));