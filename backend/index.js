const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const completion = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "Hello world",
// });
// console.log(completion.data.choices[0].text);

// Middleware to parse the request body
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function getCompletion(prompt) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 3000,
  });
  console.log('completion', completion)
  return completion.data.choices[0].text;
}

const prompt_header = "Modify CODE based on the REQUEST. Return only MODIFIED_CODE."
// Endpoint for handling POST requests to /text
app.post('/predict', async (req, res) => {
  const code = req.body.code; // Extract the text data from the request body
  const request = req.body.request; // Extract the text data from the request body

  const prompt = prompt_header + "\nCODE: " + code + "\nREQUEST: " + request + "\nMODIFIED_CODE: ";
  const completion = await getCompletion(prompt);
  console.log('Completion: ' + completion);
  res.send(completion);
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
