const { swaggerDefinition } = require('./data/doc.data');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var gamesRouter = require('./routes/game.routes');
var roomsRouter = require('./routes/room.routes');
var usersRouter = require('./routes/user.routes');
var viewsRouter = require('./routes/views.routes');

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};
  
var swaggerSpec = swaggerJSDoc(options);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/games', gamesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(request, response, next) {
    next(createError(404));
});

// error handler
app.use(function(error, request, response, next) {
    // set locals, only providing error in development
    response.locals.message = error.message;
    response.locals.error = request.app.get('env') === 'development' ? error : {};

    // render the error page
    response.status(error.status || 500);
    response.render('error');
});

module.exports = app;
