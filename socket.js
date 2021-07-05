const socketIo = require('socket.io');
const http = require('./app');
const io = socketIo(http);


function initSocket(sock) {
    console.log('새로운 소켓이 연결됐어요!');

    // 특정 이벤트가 전달됐는지 감지할 때 사용될 함수
    function watchEvent(event, func) {
        sock.on(event, func);
    }

    // 연결된 모든 클라이언트에 데이터를 보낼때 사용될 함수
    function notifyEveryone(event, data) {
        io.emit(event, data);
    }

    return {
        watchBuying: () => {
            watchEvent('BUY', (data) => {
                const emitData = {
                    ...data,
                    date: new Date().toISOString(),
                };
                notifyEveryone('BUY_GOODS', emitData);
            });
        },

        watchByebye: () => {
            watchEvent('disconnect', () => {
                console.log(sock.id, '연결이 끊어졌어요!');
            });
        },
    };
};

io.on('connection', (sock) => {
    const { watchBuying, watchByebye } = initSocket(sock);

    watchBuying();
    watchByebye();
});

