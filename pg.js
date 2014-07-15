
var pg = require('pg').native;
var conString = "/var/run/postgresql";

exports.selectAll = function (table, callback) {
var client = new pg.Client(conString);
  client.connect(function(err) {
  if(err) {
      return console.error('could not connect to postgres', err);
    }
  client.query('SELECT * FROM '+table, function(err, result) {
      if(err) {
            callback('error running query');
          }
      client.end();
      callback(null,result.rows);
        });
});
};

exports.insertPrices = function(data, callback) {
    var queryString = 'INSERT INTO price_data VALUES('+data+')';
    console.log(queryString);
    var client = new pg.Client(conString);
    client.connect(function(err) {
    if(err) {
        callback('error running query:'+err);
    }
    client.query(queryString, function(err, result) {
        if (err) throw err;
    callback(null);
    });
    });
};
