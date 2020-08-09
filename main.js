const GOOGLE_TRANSLATOR = require('@danke77/google-translate-api');
const EXPRESS = require('express');
const bodyParser = require('body-parser');
const app = EXPRESS();
const CORS = require('cors');
const PATH = require('path');
const { env } = require('process');
const LANGUAGES = require('./languages');

const DIST = PATH.join(__dirname, '/client/dist');

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

if (process.env.NODE_ENV === 'production') {
  app.use(EXPRESS.static(DIST));
  app.get('/rgstay-translator', (req, res) => {
    res.sendFile(PATH.join(DIST, 'index.html'));
  })
}


let formResponseObject = (translatedResponse) => {
  return translatedResponse.reduce((acc, curr, indx) => {
    LANGUAGES[indx].alias ? acc[LANGUAGES[indx].alias] = curr.text : acc[LANGUAGES[indx].code] = curr.text;
    return acc;
  }, {});
};

app.post('/api/translate', async (req, res) => {
  const TEXT = req.body.textToBeTranslated;
  const TRANSLATOR = LANGUAGES.map((language) => {
    return new GOOGLE_TRANSLATOR({
      from: DEFAULT_LANGUAGE.code,
      to: language.code
    }).translate(TEXT);

  });
  try {
    let responses = await Promise.all(TRANSLATOR);
    res.send({ ...{ [DEFAULT_LANGUAGE.code]: TEXT }, ...formResponseObject(responses) });
  } catch (error) {
    console.error(error);
  }
});



