'use strict';

var Backman = function () {};

Backman.prototype = {
  
  start: function() {
  	console.log(this.testString);
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
  matchRoute: function (path) {
    // match paths against this.routes array
    return false;
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
    return new RegExp('^' + Backman.router.escapeRegExp(regExpString) + '$', 'i');
  },

  escapeRegExp : function(string, chars) {
    var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
    return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
  }
}


var backman = new Backman();

console.log(backman.router);
console.log(Backman.router.matchRoute());

backman.router.addRoute('get', '/user/:id/:token/profile/whatever', function () {
  console.log('idle');
});

console.log(backman.router.routes);


// target usage
//
// var backman = new Backman();
// backman.router.addRoute('/path/:param/path', handler(paramsKeyValue));
// backman.addMiddleware(response,request,callback);
// backman.start();