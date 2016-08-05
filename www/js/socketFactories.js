angular.module('packagerouter.socketfactories', ['btford.socket-io'])
    .factory('PrimarySocketFactory', function(socketFactory) {
        //Create socket and connect to http://chat.socket.io 
        var myIoSocket = io.connect('bufferbasedrouting.herokuapp.com');

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        return mySocket;
    });