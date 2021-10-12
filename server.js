
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

let User = mongoose.model("User", userSchema);

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

app.post('/api/users/:_id/exercises', async function(req, res)
{
  await User.findOne({_id: req.params._id}, function (err, user)
  {
    var jsonShit = 
    {
      username: user.username, 
      description: req.body.description, 
      duration: req.body.duration,
      date: req.body.date,
      _id: req.params._id
    };

    console.log(user);

    res.json(jsonShit);
  });

  

  
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
