const EventEmitter = require("events");
const socket = require("socket.io-client");
var obj = new EventEmitter();
var login;
var connectiontime;
var unsuccessfull = true;


const io = socket("https://cloud.sverben.nl", {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 99999999999999
});

exports.login = function(token) {
    data = {
        "token": token
    }
    io.emit('login', data);
}

io.on('event', function(data, callback) {
    obj.emit("click", data, callback)
    //visitlink(data);
    //exports.on = "click";
})

io.on('disconnect', function() {
    console.error("Failed connecting to sverben application server MAIN, retrying")
    unsuccessfull = true;
})

io.on('fatalerror', function(data) {
    throw data;
})

io.on('connect', function() {
    connectiontime ++;
    if (login !== undefined && connectiontime > 2){
        console.log('connected, again')
        unsuccessfull = false;
        const data = {
            "token": login
        }
        io.emit('login', data);
    }
})

function respond(click, type, content, color, title) {
    data = {
        "click": click,
        "type": type,
        "content": content,
        "color": color,
        "title": title
    }
    io.emit(click, data)
}

module.exports = {
    login: function(token) {
        data = {
            "token": token
        }
        io.emit('login', data)
        login = token;
        connectiontime = 1;
    },
    event: obj,
    respond: function(click, type, content, color, title) {
        respond(click, type, content, color, title);
    }
}
