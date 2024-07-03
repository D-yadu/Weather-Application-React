const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://admin:k7SJwJluT23TbdXz@weather.pdjtfml.mongodb.net/weather?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  description: String,
  main: String
});

const Weather = mongoose.model('Weather', weatherSchema);

app.post('/api/weather', async (req, res) => {
  const { city, temperature, description, main } = req.body;
  const weather = new Weather({ city, temperature, description, main });
  try {
    await weather.save();
    res.status(201).send(weather);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.status(200).send(weatherData);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.delete('/api/weather/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Weather.findByIdAndDelete(id);
    res.status(200).send({ message: 'Weather data deleted' });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
