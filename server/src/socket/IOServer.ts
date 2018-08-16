import {Log, SocketServer} from "./socket.model";
import logger from "../util/logger";

export class IOServer extends SocketServer {
    listen() {
        super.listen();
        // this.io.on('newJob', () => {
        //     agenda.addJob()
        //         .then( () => this.io.emit('agenda', 'Done'))
        //         .catch( () => this.io.emit('agenda', 'ERROR'));
        // });
    }

    sendLog(user: string, log: Log, videoID: any) {
        this.io.to(this.onlineUsers[user]).emit('logs', log, videoID);
    }
    newRun(user: string, videoID: any, logRun: any) {
        this.io.to(this.onlineUsers[user]).emit('newRun', videoID, logRun);
    }
    endRun(user: string, videoID: any) {
        this.io.to(this.onlineUsers[user]).emit('endRun', videoID, new Date());
    }
}