var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var fs = require('fs');
var methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(ejsLayouts);
//body-parser middleware
/*express.urlencoded() middleware tells body-parser to capture urlencoded 
data (form data) and store it in req.body. The {extended: false} option 
ensures that the values in this body will either be strings or arrays*/
app.use(express.urlencoded({extended: false}));

// lists all dinosaurs
app.get('/dinosaurs', function(req, res) {
  var dinosaurs = fs.readFileSync('./dinosaurs.json');
  var dinoData = JSON.parse(dinosaurs);

  var nameFilter = req.query.nameFilter;

  if (nameFilter) {
    dinoData = dinoData.filter(function(dino) {
      return dino.name.toLowerCase() === nameFilter.toLowerCase();
    });
  }
  res.render('dinosaurs/index', {myDinos: dinoData});
});

//must be above show, which will catch request and pass in 'new' as params.idx
app.get('/dinosaurs/new', function(req, res){
  res.render('dinosaurs/new');
});

//express show route for dinosaurs (lists one dinosaur)
app.get('/dinosaurs/:idx', function(req, res) {
  // get dinosaurs
  var dinosaurs = fs.readFileSync('./dinosaurs.json');
  var dinoData = JSON.parse(dinosaurs);

  //get array index from url parameter
  var dinoIndex = parseInt(req.params.idx);

  //render page with data of the specified animal
  res.render('dinosaurs/show', {myDino: dinoData[dinoIndex]});
});


//grabs views/dinosaurs/edit.ejs
app.get('/dinosaurs/edit/:idx', function(req, res){
  var dinosaurs = fs.readFileSync('./dinosaurs.json');
  var dinoData = JSON.parse(dinosaurs);
  res.render('dinosaurs/edit', {dino: dinoData[req.params.idx], dinoId: req.params.idx});
});

app.post('/dinosaurs', function(req, res) {
  // read dinosaurs file
  var dinosaurs = fs.readFileSync('./dinosaurs.json');
  dinosaurs = JSON.parse(dinosaurs);

  // add item to dinosaurs array
  dinosaurs.push(req.body);

  // save dinosaurs to the data.json file
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs));

  //redirect to the GET /dinosaurs route (index)
  res.redirect('/dinosaurs');
});

app.delete('/dinosaurs/:idx', function(req, res){
  var dinosaurs = fs.readFileSync('./dinosaurs.json');
  dinosaurs = JSON.parse(dinosaurs);

  // remove the deleted dinosaur from the dinosaurs array
  dinosaurs.splice(req.params.idx, 1)

  // save the new dinosaurs to the data.json file
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs));

  //redirect to the GET /dinosaurs route (index)
  res.redirect('/dinosaurs');
});

app.put('/dinosaurs/:idx', function(req, res){
  var dinosaurs = fs.readFileSync('./dinosaurs.json');
  dinosaurs = JSON.parse(dinosaurs);

  //re-assign the name and type fields of the dinosaur to be editted
  dinosaurs[req.params.idx].name = req.body.name;
  dinosaurs[req.params.idx].type = req.body.type;

   // save the editted dinosaurs to the data.json file
  fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs));
  res.redirect('/dinosaurs');
});

app.listen(3000);
