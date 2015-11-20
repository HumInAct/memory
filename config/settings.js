"use strict";
// /config/settings.js
// Express server configuration

// Module imports
var fs = require('fs'),
    url = require('url'),
    cons = require('consolidate'),
    passport = require('passport'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    props = require('./properties');

module.exports = function(server, express) {
    // Session stores
    var MemStore = new express.session.MemoryStore;
    var RedisStore = require('connect-redis')(express),
        redisUrl = url.parse(props['REDIS_URL']),
        redisClient = require('redis').createClient(redisUrl.port, redisUrl.hostname, {
            no_ready_check: true
        });
    redisClient.auth(redisUrl.auth.split(":")[1]);

    var oneDay = 86400000; // one day caching duration value

    // Prepare log file stream for dev env logging
    if (props['ENV'] === 'dev') {
        var date = new Date();
        var today = date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + (date.getDate())).slice(-2);
        var log_file = fs.createWriteStream('data/logs/' + today + '.txt', {
            flags: 'w+',
            encoding: 'ANSI'
        });
        server.use(express.logger({
            immediate: true,
            format: 'dev',
            stream: log_file
        }));
    }

    // express setting
    server.configure(function() {
        server.use(express.compress()); // Compress content using GZip
        server.use(express.json()); // pull information from html in POST
        server.use(express.urlencoded());
        server.use(express.cookieParser(props['SECRET'])); // signed cookies parser
        server.use(express.session({ // session store on memory/Redis Cloud
            secret: props['SECRET'],
            store: ((props['ENV'] === 'dev') ? MemStore :
                new RedisStore({
                    client: redisClient,
                    db: 1
                })
            )
        }));
        server.use(passport.initialize());
        server.use(passport.session()); // persistent login sessions
        server.use(flash()); // use connect-flash for flash messages stored in session

        server.use(express.favicon(props['FAVICON'])); // favicon image file used
        server.use(express.static( // set the static files location /public/img will be /img for users
            ((props['ENV'] === 'dev') ? 'public/dev' : 'public/prod'), {
                maxAge: 7 * oneDay
            }));

        server.use(express.methodOverride()); // simulate DELETE and PUT
        server.use(server.router); // make Express manage routing from client
    });

    // initialize database connection
    require("./database")(((props['ENV'] === 'dev') ? props['db_localhost'] + "memory" : props['db_memory']));

    // passport config
    require('./auth/passport')(passport, ((props['ENV'] === 'dev') ? props['db_localhost'] + "user" : props['db_user'])); // pass passport for configuration, and connect to user database
    require('./auth/routes')(server, passport); // load our routes and pass in our server and fully configured passport// If the Node process ends, close the Mongoose connection


    process.on('SIGINT', function() {
        mongoose.get('memory').close(function() {
            console.log('DB> Mongoose "memory" connection disconnected through app termination');
            mongoose.get('user').close(function() {
                console.log('DB> Mongoose "user" connection disconnected through app termination');
                process.exit(0);
            });
        });
    });

    // templating engine setting
    server.engine('html', cons.swig);
    server.set('view engine', 'html');
    server.set('views', 'views');

    // vars setting
    server.set('port', props['PORT']); // port
};