const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
var models = require('./models');




const app = express();


app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json());
app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have

var env = nunjucks.configure('views', { noCache: true }); // where to find the views, caching off


models.db.sync({})
.then(models.User.sync({force: true})) //({force: true})
.then(function(){
  app.listen(1337, function(){
    console.log('Somebody\'s naked on port 1337');
  });
})
.catch(console.error);



