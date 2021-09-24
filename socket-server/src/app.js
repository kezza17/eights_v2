const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

const documents = {};

io.on("connection", socket => {
  let previousId;
  const rooms = {};

  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
    previousId = currentId;
  };

  socket.on("createRoom", roomName => {
    const room = {
      id: uuidv1(),
      name: roomName,
      sockets: []
    }

    rooms[room.id] = room;

    joinRoom(socket, room);
    console.log(roomName);;
  })

  socket.on("joinRoom", roomId => {
    const room = rooms[roomId];
    console.log(roomId);;
  })

  const joinRoom = (socket, room) => {
    room.sockets.push(socket);
    socket.join(room.id, () => {
      socket.roomId = room.id;
      console.log(socket.id, "Joined", room.id);
    })
  }

//   socket.on("ready", () => {
//     console.log(socket.id, "is ready");
//     const room = rooms[socket.roomId];
//     if (room.sockets.length == 2) {
//       for (const client of rooms.socket) {
//         client.emit('initGame');
//       }
//     }
//   })

//   socket.on("getDoc", docId => {
//     safeJoin(docId);
//     socket.emit("document", documents[docId]);
//   });

//   socket.on("addDoc", doc => {
//     documents[doc.id] = doc;
//     safeJoin(doc.id);
//     io.emit("documents", Object.keys(documents));
//     socket.emit("document", doc);
//   });

//   socket.on("editDoc", doc => {
//     documents[doc.id] = doc;
//     socket.to(doc.id).emit("document", doc);
//   });

//   io.emit("documents", Object.keys(documents));

//   console.log(`Socket ${socket.id} has connected`);
})

http.listen(4444, () => {
  console.log('Listening on port 4444');
});