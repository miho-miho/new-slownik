const express = require('express');
const mysql = require('mysql');
const app = express();

// .env から設定を読み込む
require('dotenv').config();
const env = process.env;

app.use(express.static('public'));

const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.use(express.urlencoded({
  extended: false
}));

//ホームの表示
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// 検索前画面
app.get('/table', (req, res) => {
  res.render('table.ejs', {
    rsMeta: [],
    rsWordlist: [],
  });
});

// 検索結果画面
app.post('/table', (req, res) => {
  connection.query('SELECT * FROM meta WHERE headword = ? LIMIT 1',
    [req.body.wordItem],
    function (err, rows, fields) {

      if (err) {
        console.log('err(meta): ' + err);
      }

      const rsMeta = rows;

      connection.query('SELECT * FROM wordlist WHERE mia = ? LIMIT 1',
        [req.body.wordItem],
        function (err, rows, fields) {

          if (err) {
            console.log('err(wordlist): ' + err);
          }
          const rsWordlist = rows;

          res.render('table.ejs', {
            rsMeta: rsMeta,
            rsWordlist: rsWordlist,
          });

        });

    });
});


app.listen(3000);
