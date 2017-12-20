//@ts-check
const async = require('async');
const HttpStatus = require('http-status');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const natural_language_understanding = new NaturalLanguageUnderstandingV1({
  username: '900a1c3d-1276-4ab8-83d4-283431144511',
  password: 'LiEIrU5apzAv',
  version_date: '2017-02-27'
});

/**
 * Analyse message with watson API
 * only analyse if > x words
 * @param {string} text
 * @param {any} callback
 */
const analyseMessage = (text, callback) => {
  if (text.split(' ').length > 10) {
    const parameters = {
      text,
      features: {
        keywords: {
          emotion: true,
          sentiment: true,
          limit: 2
        }
      }
    };

    natural_language_understanding.analyze(parameters, (err, response) => {
      if (err) {
        console.log('error:', err);
        callback(err);
      } else {
        callback(null, response);
      }
    });
  } else {
    callback(null, 'Not enough words');
  }
};

/**
 * Analyse
 * @param {*} req
 * @param {*} res
 */
exports.analyse = (req, res) => {
  const messages = req.body.messages;
  async.map(messages, analyseMessage, (err, response) => {
    if (err) {
      console.log('error:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    } else {
      res.status(HttpStatus.OK).send(response);
    }
  });
};
