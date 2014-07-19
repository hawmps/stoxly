//Stock tracker!
//Dependencies
var request = require('request');
var fs = require('fs');
var query = require('./pg.js');


/*Read stock symbols from file
 * Filename: symbols
 * Location: __dirname
 * Returns var syms2, a String with all the stock codes ready to be inserted into a YQL statement
 */
var symbols = [];
var syms = [];
query.selectAll('symbols', function(err, result){
    if(err) throw err;
    result.forEach(function(element,index){symbols[index]=element.symbol;});
    console.log(symbols);
for (var symbol in symbols) {
    syms[symbol] = '"'+symbols[symbol]+'"';
}
syms.pop();
var syms2 = syms.join();

/* Request previous days close prices from Yahoo via YQL query 
 * No auth needed
 * Appends Symbol,PreviousClose to file
 * Filename stockdata.csv
 * Location __dirname
 */ 
var stocks = 'Select PreviousClose from yahoo.finance.quotes where symbol in ('+syms2+')';
var options = {
    url:     'https://query.yahooapis.com/v1/public/yql',
    encoding: 'utf-8',
    method:  'GET',
    qs:      {q:  stocks, format: 'json', env: 'store://datatables.org/alltableswithkeys'}
};

function goInsert (qs){
query.insertPrices(qs, function(err) {
    if(err) throw err;
    });
}

var prices = {};
request(options,function(err, res, body) {
    if (err) throw err;
    prices = JSON.parse(res.body);
    var date = new Date().toISOString();
    for (var ticker in prices.query.results.quote) {
        var data = ('\''+date+'\',\''+symbols[ticker]+'\','+prices.query.results.quote[ticker].PreviousClose+'\n');
        goInsert(data);
        }
});
});
