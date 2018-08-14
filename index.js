const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser')
const db = new Database('./db/shoutbox.db');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', async (req, res) => {
  const shouts = db.prepare('SELECT * FROM shouts').all();
  res.render('pages/index', { shouts })
});

app.get('/add-entry', (req, res) => {
  res.render('pages/add-entry', { success: true });
});

app.post('/add-entry', (req, res) => {
  if (req.body.username && req.body.message) {
    var stmt = db.prepare('INSERT INTO shouts(username, message) VALUES (?, ?);');

    stmt.run(req.body.username, req.body.message);

    res.redirect('/');
  } else {
    res.render('pages/add-entry', { success: false });
  }
});

const server = app.listen(port, () => {
 console.log(`Server listening on port ${port}…`)
});

module.exports = server
