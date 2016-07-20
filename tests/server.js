var Backman = require('../backman.core.js')

var backman = new Backman();

backman.router.addRoute('get', /user\.*/ , function (request,response,next) {
  response.write('1');
  next();
});

backman.router.addRoute('get', '/user/:id/:token/profile/whatever', function (request,response,next) {
  response.end('2');
});

backman.start();
