var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Tessica&Jiana',
        text: 'Do our bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Tessica&Jiana',
        text: 'Do our bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        // debugger;
        expect(messages[0].username).to.equal('Tessica&Jiana');
        expect(messages[0].text).to.equal('Do our bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });


  it('Should respond to OPTIONS requests from /classes/messages with a 200 status code', function(done) {
    var requestParams = {method: 'OPTIONS',
      uri: 'http://127.0.0.1:3000/classes/messages',
    };
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should 400 when receiving POST requests to anywhere but /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000',
      json: {
        username: 'Super Shepherd James',
        text: 'To the rescue!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should accept DELETE requests to /classes/messages', function(done) {
    var requestParams = {method: 'DELETE',
      uri: 'http://127.0.0.1:3000/classes/messages',
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should respond to DELETE requests with an empty results array', function(done) {
    var requestParams = {method: 'DELETE',
      uri: 'http://127.0.0.1:3000/classes/messages',
    };
    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        // debugger;
        expect(messages.length).to.equal(0);
        done();
      });
    });
  });

});
