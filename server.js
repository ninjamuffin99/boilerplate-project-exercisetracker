
const {v4: uuidv4} = require('uuid');

const express = require('express')
const app = express()
const cors = require('cors')

const bodyParser = require('body-parser');

var mongoose = require("mongoose");
const { json } = require('body-parser');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const {Schema} = mongoose;

const userSchema = new Schema({
  username: String,
  _id: String
});

const excerciseSchema = new Schema({
  lolID: String,
  description: String, 
  duration: Number, 
  date: String,
  timestamp: Number
})



let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", excerciseSchema);

require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async function(req, res)
{
  await User.find({}, function (err, users)
  {
    if (err) return console.log(err);

    res.send(users);
  });
});


app.post("/api/users", function(req, res)
{
  console.log(req.body);

  var jsonShit = {username: req.body.username,  _id: uuidv4()};

  User.create(jsonShit, function (err, user)
  {
    if (err) return console.log(err);

    res.json(jsonShit);
  });

  
});

app.get('/api/users/:_id/logs', async function (req, res)
{

  await User.findOne({_id: req.params._id}, async function (err, user)
  {
    if (err) return console.log(err);

  
    var limiter = parseInt(req.query.limit);

    var funnyExercise = Exercise.find({lolID: req.params._id});

    if (limiter)
      funnyExercise.limit(limiter);
    
    

    var dateMin = req.query.from;

    if (dateMin)
    {
      console.log("has date min!");
      console.log(dateMin);
      console.log(Math.floor(new Date(dateMin)));

      funnyExercise.find({timestamp: {$gte: Math.floor(new Date(dateMin))}});
    }

    var dateMax = req.query.to;

    if (dateMax)
    {
      funnyExercise.find({timestamp: {$lte: Math.floor(new Date(dateMax))}});
    }
    
    funnyExercise.select({timestamp: 0, timestampDate: 0, lolID: 0, _id: 0, __v: 0});

    funnyExercise.exec(function (err, exList)
    {

      var logJson = 
      {
          username: user.username,
          _id: req.params._id,
          count: exList.length,
          log: exList
      }; // create log object


      res.send(logJson);
    });

  });
});

app.post('/api/users/:_id/exercises', async function(req, res)
{
  await User.findOne({_id: req.params._id}, function (err, user)
  {

    var funnyDate = new Date(req.body.date).toString();

    if (funnyDate == "Invalid Date")
    {
      // var dateNow = new Date(Date.now());

      // dateNow.setDate(dateNow.getDate() - 1);

      funnyDate = Date();
    }
      

    var jsonShit = 
    {
      username: user.username, 
      description: req.body.description, 
      duration: parseInt(req.body.duration),
      date: new Date(funnyDate).toDateString(),
      _id: req.params._id
    };


    Exercise.create({lolID: req.params._id, description: jsonShit.description, duration: jsonShit.duration, date: jsonShit.date, timestamp: Math.floor(new Date(funnyDate))});

    // log

    // console.log(user);

    res.json(jsonShit);
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
