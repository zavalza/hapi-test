'use strict';

const Hapi = require('hapi');
const Joi = require('joi');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.register(require('./mongo-plugin'), (err) => {
  if(err) {
    console.log('failed to load mongo plugin');
  }
  else {
    // Add the routes
    server.route({
      method: 'GET',
      path:'/companies', 
      handler: function (request, reply) {
        return reply(request.server.app.db.company.find());
      }
    });

    server.route({
      method: 'GET',
      path:'/companies/{id}', 
      handler: function (request, reply) {
        return reply(request.server.app.db.company.findById(request.params.id));
      },
      config: {
        validate: {
            params: {
              id: Joi.string().alphanum().min(10).required()
            }
        }
      }
    });

    server.route({
      method: 'POST',
      path:'/companies', 
      handler: function (request, reply) {
        var company = new request.server.app.db.company(request.payload);
        company.save().then(function(saved_company){
          return reply(saved_company);
        })
      },
      config: {
        validate: {
            payload: {
              name: Joi.string().required(),
              description: Joi.string(),
              address: Joi.string(),
              country: Joi.string().required()
            }
        }
      }
    });

    // Start the server
    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
  }
});
