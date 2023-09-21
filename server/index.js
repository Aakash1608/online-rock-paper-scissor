const express = require('express');
const app = express();
const cors = require('cors')
const { createServer } = require('http');
const generateUniqueId = require('generate-unique-id');
const server = createServer(app);
const { Server } = require('socket.io');
app.use(cors({
    origin: "*",
    credentials: true
}))
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(express.static("public"));


app.get('/api-v1/', (req, res) => {
    res.status(200).json({msg: 'hello'})
})
let groupQ = [];
let groupListResult = [];
const findRoom = (room) => {
    const any = groupListResult.findIndex((r) => r.groupId === room);
    if(groupListResult.length == 0){
        return -1;
    }
    return any;
}
io.on('connection', (socket) => {
    console.log("User Conneted")

    socket.on('game-started', ({userName}) => {
        if(groupQ.length != 0){
            let currG = groupQ[0];
            groupQ.shift();
            currG.user.push(userName)
            socket.join(currG.groupId);
            io.sockets.in(currG.groupId).emit('game-set', currG)
        }else {
            let groupId = generateUniqueId({
                length: 32,
                useLetters: userName
              });
            groupQ.push({
                groupId: groupId,
                user: [userName]
            })
            socket.join(groupId);
            io.sockets.in(groupId).emit('finding-game', {
                groupId: groupId,
                user: [userName]
            });
        }
    })

    socket.on("choice", (data) => {
        let roomIndex = findRoom(data.groupId);
        if(roomIndex != -1) {
            let opData = groupListResult[roomIndex];
            groupListResult = groupListResult.filter((r) => r.groupId != data.groupId)
            let choice1 = opData.userDetail.choice;
            let choice2 = data.userDetail.choice;
            let user1 = opData.userDetail.username;
            let user2 = data.userDetail.username;
            if(choice1 == 'paper'){
                if(choice2 == 'rock'){
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins+1,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }else if(choice2 == 'scissor'){
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins+1,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }else {
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }
            }else if(choice1 == 'rock'){
                if(choice2 == 'scissor'){
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins+1,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }else if(choice2 == 'paper'){
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins+1,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }else {
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }
            }else if(choice1 == 'scissor'){
                if(choice2 == 'paper'){
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins+1,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }else if(choice2 == 'rock'){
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins+1,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }else {
                    io.sockets.in(data.groupId).emit("result", {
                        groupId: data.groupId,
                        userDetail: [
                            {
                                username: user1,
                                wins: opData.userDetail.wins,
                                choice: choice1
                            },
                            {
                                username: user2,
                                wins: data.userDetail.wins,
                                choice: choice2
                            }
                        ],
                        gameDetail: {
                            round: data.gameDetail.round+1
                        }
                    })
                }
            }
        }else {
            groupListResult.push(data);
        }
    })
    socket.on("final-winner", (data) => {
        io.sockets.in(data.groupId).emit("final-winner", data);
    })
    socket.on('game-left', (data) => {
        io.sockets.in(data.groupId).emit("game-left", data);
    })
    socket.on('disconnect', () => {
        console.log("User disconnected")
    })
})

server.listen('8000', () => {
    console.log("Server Running on Port 8000")
})