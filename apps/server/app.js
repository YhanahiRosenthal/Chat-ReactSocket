import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import {dirname, join} from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on('connect', socket => {
    console.log('client online', socket.id)

    socket.on('message', (data) => {
        io.emit('messages', data);
    })
})
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url))
const frontPath = join(__dirname, "..", "front", "dist");
app.use(express.static(frontPath));

app.get("/", (req, res) => {
  const indexPath = join(frontPath, "index.html");
  res.sendFile(indexPath);
});
server.listen(port, () => {
    console.log('Listen port: ', port)
})