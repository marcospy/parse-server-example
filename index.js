var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '',
  javascriptKey: process.env.JAVASCRIPT_KEY || '',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  liveQuery: {
    classNames: []
  },
  push: {
    android: {
      senderId: process.env.PUSH_ANDROID_SENDER_ID,
      apiKey: process.env.PUSH_ANDROID_API_KEY
    }
  }
});

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});

// Enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
