var should = require('should');
var Backman = require('../backman.core.js')
var http = require('http');


describe('Router', function() {
	describe('paths processing', function () {
		it('should call multiple handlers correct', function(done) {
			var backman = new Backman();

			backman.router.addRoute('get', /user\.*/ , function (request,response,next) {
			  response.write('1');
			  next();
			});

			backman.router.addRoute('get', '/user/:id/:token/profile/whatever', function (request,response,next) {
			  response.end('2');
			});

			backman.start();

			var requestOptions = {
				port: 8000,
				host: 'localhost',
				method: 'GET',
				path: '/user/43234/43234/profile/whatever'
			};

			var request = http.request(requestOptions, (response) => {
				var responseContent = '';
				response.on('data', (data) => {
					responseContent += data;
				});
				response.on('end', () => {
					should.equal(responseContent, '12');
					done();
				})
			});

			request.end();
		})
	})
});