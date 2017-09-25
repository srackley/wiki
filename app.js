const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
var models = require('./models');
const app = express();
const routes = require('./routes/index.js');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json());

app.use(routes);
app.use(express.static(path.join(__dirname, '/public')));

app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have

var env = nunjucks.configure('views', { noCache: true }); // where to find the views, caching off

models.db.sync({})
.then(models.User.sync({}))
.then(function(){
    return models.Page.sync({})
}) 
.then(function(){
  app.listen(4000, function(){
    console.log('Somebody\'s naked on port 3000');
  });
})
.catch(console.error);



