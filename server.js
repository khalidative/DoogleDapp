var Seneca = require("seneca");
var Web = require("seneca-web");
var path = require('path');
var bodyParser = require("body-parser");
//var {URLSearchParams} = require('url');
var seneca = Seneca();
var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// to serve our JavaScript, CSS and index.html
app.use(express.static('./'));

var pusher = new Pusher({
  appId: '739282',
  key: 'ce535f00bee1fa571f29',
  secret:  'd9c6973066871bc2bcbc',
  cluster: 'ap2',
  encrypted: true
});

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

var port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening at http://localhost:5000'));

//start crawling from here
const rp = require('request-promise');
const cheerio = require('cheerio');
var Crawler = require("js-crawler");
var crawler = new Crawler().configure({ignoreRelative: false, depth: 2});
 
const url = 'http://codewaleed.me';
indeces = [];

crawler.crawl({
  url: url,
  success: function(page) {
    console.log(page.url);
    //index the url
    rp(page.url)
    .then(function(html){
      //success!
      var $ = cheerio.load(html);
      var title = $("title").text()
      var keywords = $("meta[name='keywords']").attr("content").split(/[\s,]+/)
      for(var i = 0; i < keywords.length; i++)
      {
        indeces.push(page.url + "<>" + keywords[i].toLowerCase() + "<>" + $("title").text() + "<>" + $("meta[name='description']").attr("content"));
      }
    })
    .catch(function(err){
      //handle error
    });
  },
  failure: function(page) {
    console.log(page.status);
  },
  finished: function(crawledUrls) {
    console.log(indeces);
    //console.log(crawledUrls);
  }
});



//========================================================================

var config = {
  routes: {
    prefix: "/nodes",
    pin: "role:api,cmd:*",
    map: {
      sync: {
        GET: true
      }
    }
  }
};

seneca.use(Web, {
  adapter: require('seneca-web-adapter-express'),
  context: app
})
seneca.act("role:web", config);

// var cmdList = [];
// seneca.add("role:api,cmd:cmdlist", function(req, done) {
//   done(null, {
//     response: cmdList
//   });
// });


seneca.add("role:api,cmd:sync", function(req, done) {
  try {
    console.error(indeces);
    done(null, {
      crawledLinks: indeces
    });
  } catch (error) {
      console.error(error);
      done(null, {
        crawledLinks: error
      });
  }
});

//========================================================================



// function validURL(str) {
//   var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//   return !!pattern.test(str);
// }