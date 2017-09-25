const express = require("express");
const router = express.Router();
module.exports = router;
var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.post('/', function(req, res, next) {
 console.log(req.body);
    var page = Page.build({
        title: req.body.title,
        content: req.body.content
  });
    var user = User.build({
        name: req.body.name,
        email: req.body.email
    });
  user.save();
  page.save().then(function(savedPage){res.redirect(savedPage.route);
  });
});

router.get('/', function(req, res, next){
    res.redirect('/');
    });

router.get('/add', function(req, res, next){
    res.render('addpage');
    });

router.get('/:urlTitle', function(req, res, next){
    Page.findOne({
       where: { 
           urlTitle: req.params.urlTitle
       }
    })
    .then(function(searched){
        // res.json(searched);
        res.render('wikipage', searched);
    })
    .catch(next);
});

router.use('/user', require('./user'));