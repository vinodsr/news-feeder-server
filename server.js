var request = require('request');
var express = require("express");

var app = express();

const SERVER_PORT = 3000;

function toASCII(chars) {
  var ascii = '';
  for (var i = 0, l = chars.length; i < l; i++) {
    var c = chars[i].charCodeAt(0);
    if (chars[i] == "’") {
      ascii += "'";
    } else if (chars[i] == "”") {
      ascii += "\"";
    } else if (chars[i] == "“") {
      ascii += "\"";
    } else {
      if (c >= 0xFF00 && c <= 0xFFEF) {
        c = 0xFF & (c + 0x20);
      }

      ascii += String.fromCharCode(c);
    }
  }

  return ascii;
}


app.get("/test", function(req, res) {
  var data = "";
  res.oldWriteHead = res.writeHead;
  contentLength = 50;

  data += "1\n";
  data += "100\n";
  data += "2\n";


  request(
    'https://newsapi.org/v1/articles?source=the-hindu&sortBy=top&apiKey=21ea495f516d47f78e356d7c1641d7ed',
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var feeddata = JSON.parse(body);
        for (i in feeddata.articles) {
          entry = feeddata.articles[i];
          console.log(entry.title, entry.description);

          //strip all , to ;
          entry.description = entry.description.replace(",", ";");

          entry.description = entry.description.toUpperCase();

          data += "1000\n" + entry.description.length + "\n" + toASCII(
              entry.description) +
            "\n";
          console.log(data);
        }
        res.header('Content-Type', 'text/plain');
        // res.write(data);
        res.send(data);
      }
    });



})


console.log("Application started  at port ", SERVER_PORT);

app.listen(SERVER_PORT);
