const axios = require('axios');
const EXPRESS = require('express');
const bodyParser = require('body-parser');
const app = EXPRESS();
const CORS = require('cors');
const PATH = require('path');
const LANGUAGES = require('./languages');

const DIST = PATH.join(__dirname, '/client/dist');
const API_URL = 'https://api.cognitive.microsofttranslator.com/translate'
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(CORS());

const DEFAULT_LANGUAGE = {
  code: 'en',
  name: 'english'
};


app.listen(process.env.PORT || 3000, () => {
  console.log(`APP is running successfully in ${process.env.PORT || 3000}`);
});

// if (process.env.NODE_ENV === 'production') {
app.use(EXPRESS.static(DIST));
app.get('/rgstay-translator', (req, res) => {
  res.sendFile(PATH.join(DIST, 'index.html'));
})
// }


let formResponseObject = (translatedResponse) => {
  return translatedResponse.reduce((acc, curr, indx) => {
    acc[LANGUAGES[indx].code] = curr.data[0].translations[0].text;
    return acc;
  }, {});
};

app.post('/api/translate', async (req, res) => {
  let text = req.body.textToBeTranslated;
  const TRANSLATOR = LANGUAGES.map(language => {
    return axios.post(
      API_URL,
      [{ text }],
      {
        params: {
          'api-version': '3.0',
          'from': DEFAULT_LANGUAGE.code,
          'to': language.code
        },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.TRANSLATOR_KEY,
          'Content-type': 'application/json'
        }
      }
    )
  })
  try {
    let responses = await Promise.all(TRANSLATOR);
    res.send({ ...{ [DEFAULT_LANGUAGE.code]: text }, ...formResponseObject(responses) });
  } catch (error) {
    console.error(error);
  }
});

