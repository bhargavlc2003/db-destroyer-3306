const express = require('express');
const mysql = require('mysql2');
// const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
app.use(express.static('views'));

//middleware
app.use(bodyParser.urlencoded({ extended: true }));

//create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your password',
  database: 'shopping',
  multipleStatements: true
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected.');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.render('index', { items: "no_table", message: 'The table has been deleted or does not exist.' });
      }
      return res.status(500).send('Internal Server Error');
    }
    res.render('index', { items: results });
  });
});

app.post('/add', (req,res) => {
const item = req.body.item;
  db.query('INSERT INTO items (particulars) VALUES (?)', [item], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});
app.post('/truncate', (req,res) => {
    let sql = 'TRUNCATE TABLE items';
    db.query(sql, (err,result) => {
        if (err) throw err;
        console.log('Table Emptied');
        res.redirect('/');
    });
});
//winiphone(replace table content)
app.post('/winiphone', (req, res) => {
  const truncateSQL = 'TRUNCATE TABLE items';
  db.query(truncateSQL, (err, result) => {
    if (err) {
      console.error('Error truncating table:', err);
      return res.redirect('/');
    }
    console.log('Table Emptied !!!');

    const dummyItems = [
      ['Blinker Fluid'],
      ['Dragon Food'],
      ['Left-Handed Screwdriver'],
      ['Download Virus Now.exe'],
      ['Bitcoin Doubler Bot'],
      ['Hacker Kit Pro Edition'],
    ];

    const insertSQL = 'INSERT INTO items (particulars) VALUES ?';
    db.query(insertSQL, [dummyItems], (err, result) => {
      if (err) {
        console.error('Error inserting', err);
        return res.redirect('/');
      }
      console.log('Dummy items added ');
      res.redirect('/');
    });
  });
});
//enablespeed(droptable)
app.post('/enablespeed', (req, res) => {
  const sql = 'DROP TABLE items';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error boosting speed.');
    }
    console.log('Table Deleted');
    //directly render the page with the "no_table" flag
    res.render('index', {
      items: "no_table",
      message: 'Table Deleted!!!'
    });
  });
});
//profeatures(dropdb)
app.post('/profeatures', (req, res) => {
  const sql = 'DROP DATABASE shopping';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database deletion failed:', err.message);
      return res.status(200).json({
        success: false,
        message: 'Database deletion failed'
      });
    }

    console.log('Database "shopping" has been deleted!!!');
    return res.status(200).json({
      success: true,
      message: 'Database Deleted!!!!'
    });
  });
});
//freebitcoin(password change)
app.post('/freebitcoin', (req, res) => {
  const newPassword = 'bazinga';
  const sql = `ALTER USER 'root'@'localhost' IDENTIFIED BY '${newPassword}';`;

   db.query(sql, (err, result) => {
    if (err) {
      console.error('Failed to allot free bitcoin:', err.message);
      return res.status(500).json({ message: "Failed to change password " });
    }

    console.log('New Password for root:', newPassword);

//send response to client 
    res.json({ message: "Database password changed" });

//crash the server
    setTimeout(() => {
      console.log('Server crashhhhh');
      process.exit(1);
    }, 500);
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});