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

//データベースとの接続確認
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');　　//問題なければ「success」を
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
    rsWordlist: []
  });
});

app.post('/search',function(req,res){
  connection.query('SELECT w.mia, w.dop, w.cel, w.bie, w.narz, w.mie, w.wol, w.mia_wol, w.dop_pl, w.cel_pl, w.bie_pl, w.narz_pl, w.mie_pl, m.headword, m.japanese  FROM wordlist w LEFT OUTER JOIN meta m ON m.id = w.meta_id WHERE (w.mia LIKE ?) OR (w.dop LIKE ?) OR (w.cel LIKE ?) OR (w.bie LIKE ?) OR (w.narz LIKE ?) OR (w.mie LIKE ?) OR (w.wol LIKE ?) OR (w.mia_wol LIKE ?) OR (w.dop_pl LIKE ?) OR (w.cel_pl LIKE ?) OR (w.bie_pl LIKE ?) OR (w.narz_pl LIKE ?) OR (w.mie_pl LIKE ?)',
    [
      req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
      , req.body.wordItem + '%'
    ],
      function (err, rows, fields) {
        res.json({
        message:rows  //結果を「message」に代入
      });
    });
  });


// 検索結果画面
app.post('/table', (req, res) => {

  connection.query('SELECT w.id, w.mia, w.dop, w.cel, w.bie, w.narz, w.mie, w.wol, w.mia_wol, w.dop_pl, w.cel_pl, w.bie_pl, w.narz_pl, w.mie_pl, m.headword, m.japanese, m.gender FROM wordlist w LEFT OUTER JOIN meta m ON m.id = w.meta_id WHERE (w.mia LIKE ?) OR (w.dop LIKE ?) OR (w.cel LIKE ?) OR (w.bie LIKE ?) OR (w.narz LIKE ?) OR (w.mie LIKE ?) OR (w.wol LIKE ?) OR (w.mia_wol LIKE ?) OR (w.dop_pl LIKE ?) OR (w.cel_pl LIKE ?) OR (w.bie_pl LIKE ?) OR (w.narz_pl LIKE ?) OR (w.mie_pl LIKE ?)',
  [
    req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
    , req.body.wordItem + '%'
  ],
      function (err, rows, fields) {
          if (err) {
            console.log('err(wordlist): ' + err);
          }

          const rsWordlist = rows;

          res.render('table.ejs', {
            rsWordlist: rsWordlist
          });
        });
    });

//単語リクエスト画面
app.get('/request', (req, res) => {
  connection.query(
    'SELECT * FROM request',
    (error, results) => {
      res.render('request.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  // データベースに追加する処理を書いてください
  connection.query(
    'INSERT INTO request (newword) VALUES (?)',
    [req.body.newWrod],
    (error, results) => {
      res.redirect('/request')
     }
   );
});


app.listen(3000);
