const Database = require('better-sqlite3')
const bodyParser = require('body-parser')
const path  = require('path')
const fs = require('fs')
const request = require('supertest')
const db = new Database('./db/shoutbox.db');
let app

describe('index.js', () => {
  beforeAll(() => {
    app = require('./../index.js')
  })

  afterAll(() => {
    app.close()
  })

  it('Should have the form element somewhere', (done) => {
    fs.readFile(path.resolve('views/pages/index.ejs'), 'utf8', function (err, text) {
      expect(text.indexOf('form') > -1).toBeTruthy()
      done()
    });
  });

  it('Should create an GET index \'/\' route', async () => {
    await expect(request(app).get('/')).resolves.toHaveProperty('status', 200);
  });

  it('Should create an GET \'/api/shouts\' route', async () => {
    await expect(request(app).get('/api/shouts')).resolves.toHaveProperty('status', 200);
  });

  it('Should store stuff in the Database when calling POST \'/add-entry\' route', async () => {
    await expect(request(app)
        .post('/api/shouts')
        .send({username: 'TESTING SCRIPT', message: 'TESTING DATA'})
    ).resolves.toHaveProperty('status', 200);
    

    const {username, message} = db.prepare('SELECT * FROM shouts WHERE username=?').get('TESTING SCRIPT');
    expect(username).toEqual('TESTING SCRIPT');
    expect(message).toEqual('TESTING DATA');
    db.prepare('DELETE FROM shouts WHERE username=?').run('TESTING SCRIPT');
  });
});
