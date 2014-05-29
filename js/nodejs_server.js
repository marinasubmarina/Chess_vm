var io = require('socket.io').listen(8000);
var r = 1; //номер комнаты
var leaveRoom=null;
var tmpRoom=null;

io.sockets.on('connection', function (socket){
    var gameRooms = [];//список используемых комнат
    if (leaveRoom!=null){
        tmpRoom=r;
        r=leaveRoom;
        leaveRoom=null;
    }
    if(tmpRoom!=null){
        r=tmpRoom;
        tmpRoom=null;
    }

    socket.join('room'+r);
    var socketRooms = io.sockets.manager.rooms; // список созданных комнат
    gameRooms['room'+r] = 0; //0 - не закрыта
    for (var room in socketRooms) {
        var gamersNum = socketRooms[room].length;
//slice нужен, т.к. room возвращает комнату в формате '/room1',
//а *.in() требует просто room. Срезаем '/'' спасиб ставу

        var _room = room.slice(1, room.length);
// console.log(socketRooms[_room]);

        if (room != '') { //корневую комнату не смотрим
            console.log('Игроков в комнате '+_room+': '+gamersNum);
// 'room: ' +room + ' arr[room]: '+roomsArr[room]+' игроков в комнате: '+roomsArr[room].length);
            if ((gamersNum == 2) && (gameRooms[_room] == 0)) {
                socket.broadcast.in(_room).emit('start', 'white');
                socket.emit('start', 'black'); //отправляем сообщение о старте игры
                console.log('Игра началась в комнате'+room+'!');
                gameRooms[_room] = 1;//комната занята
                r++;
            }
        }
    }
    console.log(gameRooms)
    for (var room in gameRooms) {
        console.log ('Комната: '+room+ ', закрыта? :'+ gameRooms[room]);
    }
    console.log('Client connected');
    socket.on ('step', function (x,y,x1,y1){
        console.log('step');
        for (var room in io.sockets.manager.roomClients[socket.id]) { //проход по всем комнатам
            if (room != '') { //если не главная (с пустым названием)
                _room = room.slice(1,room.length); //отрезаем '/'
                socket.broadcast.in(_room).emit('step',parseInt(x),parseInt(y),parseInt(x1),parseInt(y1)); //передаем данные клиенту в комнату из которой они пришли
            }
        }
    })
    socket.on('finish', function(){
        console.log('game end');
    })
    socket.on('disconnect', function(){
        for (var room in io.sockets.manager.roomClients[socket.id]) {
            if (room != ''){
                var _room = room.slice(1,room.length); //отрезаем '/'
                console.log('открываю комнату '+_room)
                var roomNum=_room.slice(4)
                leaveRoom=roomNum;
                gameRooms[_room] = 0; //комната свободна
                socket.broadcast.in(_room).emit('disconnect'); //рассылаем "дисконнет"
            }
        }
        console.log('client disconnected');
    })
})