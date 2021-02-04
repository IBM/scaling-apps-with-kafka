/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();
var port = process.env.PORT || 8090;

// serve the files out of ./public as our main files

app.use(express.static('.'));
const pino = require('pino-http')()

app.use(pino)

const logger = require('pino')()

// const child = logger.child({ a: 'property' })
// child.info('hello child!')


// start server on the specified port and binding host
app.listen(port);
logger.info('scaling apps with kafka, starting up on port: ' + port);
