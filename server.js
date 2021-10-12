
import {v4 as uuidv4} from 'uuid';

const express = require('express')
const app = express()
const cors = require('cors')

const bodyParser = require('body-parser');



require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", function(req, res)
{
  console.log(req.body);
  res.json({username: req.body.username,  _id: uuidv4()});
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
