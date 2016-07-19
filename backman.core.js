'use strict';

var https = require ('https');
var http = require ('http');
var Logman = require ('logman');

var logman = new Logman({methodName: 'Backman', date: false});
var Backman = function () {};

Backman.prototype = {
  
  start: function() {
    logman.logThis('Server started');
    var server = http.createServer((request, response) => {
      var path = Backman.router.stripPath(request.url);
      var pathMatches = Backman.router.findMatchingRoutes(path, this.router.routes);
      Backman.pipeline(request,response,pathMatches);
    });

    server.listen(8000);
  },
  

  

  router: {
  	routes: [],

  	addRoute: function (method, path, handler) {
      path = Backman.router.stripPath(path);
      var keys = [];
      path = Backman.router.pathToRegExp(path, keys);

      var newRoute = {
        keys : keys,
        path : path,
        method : method,
        options : null,
        handler : handler
      };

      this.routes.push(newRoute);
  	},
  },
}

          

// static stuff
Backman.router = {
  matchRoute: function (candidate, original) {
    if (!candidate || !original || !original.path) return false;
    var matches = original.path.exec(candidate);
    return !!matches;
  },

  findMatchingRoutes: function (path, routes) {
    var matches = [];
    for (var i = 0; i < routes.length; i++) {
      if (Backman.router.matchRoute(path, routes[i])) {
        matches.push(routes[i]);
      }
    }
    return matches;
  },

  stripPath: function (path) {
    return path.replace(/^(\s*|\/)*|(\s*|\/)*$/,"");
  },

  pathToRegExp: function (path, keys) {
    var keysRegExp = /:(\w+)/g;
    var regExpString = path.replace(keysRegExp, function (string, key) {
      console.log(key);
      keys.push(key);
      return '(.*)';
    });
    return new RegExp('^' + Backman.router.escapeRegExp(regExpString, '/') + '$', 'i');
  },

  escapeRegExp : function(string, chars) {
    var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
    return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
  }
};

Backman.pipeline = function (request, response, pathsArray) {
  var next = function() {
    pathsArray.shift();
    Backman.pipeline(request, response, pathsArray);
  }
  if (pathsArray.length > 0) {
    pathsArray[0].handler(request,response,next);
  }
}

module.exports = Backman;


var backman = new Backman();

console.log(backman.router);
console.log(Backman.router.matchRoute());

backman.router.addRoute('get', '/user/:id/:token/profile/whatever', function (request,response,next) {
  console.log('first path processed, calling next');
  next();
});

backman.router.addRoute('get', '/user/:id/:token/profile/whatever', function (request,response,next) {
  console.log('second path processed, finishing response');
  response.setHeader("ContentType", "application/json");
  response.end('{"title":"Hola"}');
});

console.log(backman.router.routes);

backman.start();

// target usage
//
// var backman = new Backman();
// backman.router.addRoute('/path/:param/path', handler(paramsKeyValue));
// backman.addMiddleware(response,request,callback);
// backman.start();