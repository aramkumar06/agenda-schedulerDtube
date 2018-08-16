import * as steem from 'steem';
import * as md5 from 'md5';
import {ioServer} from '../../index';
import DBClient from '../../src/database/dbClient';
import {ObjectID} from "bson";
const ObjectId = require('mongodb').ObjectID;

export class SteemController {
    readonly user: string;
    readonly key: string;
    readonly videoID!: ObjectID;

    constructor(attrs: any) {
        this.user = attrs.data.username;
        this.key = attrs.data.key;
        this.videoID = ObjectId(attrs.data.id);
        steem.api.setOptions({ url: 'https://api.steemit.com' });
    }

    private async sendLog(type: string, message: string) {
        const log = {type: type, date: new Date(), message: message};
        await DBClient.update({_id: this.videoID}, {$push: {logs: log}}, 'videos');
        ioServer.sendLog(this.user, log, this.videoID);
    }

    private async endProcess() {
        console.log('Scheduler ended');
        await this.sendLog('log',' Job Terminated');
        ioServer.endRun(this.user, this.videoID);
    }

    public async start() {
        try {
            const video = await DBClient.findOne({_id: this.videoID}, 'videos');
            await this.sendLog('log', 'Video info retrieved.');
            await this.shareToSteemAndDtube(video);
        } catch (error) {
            await this.sendLog('error', error);
            await this.endProcess(); }
    }

    private async shareToSteemAndDtube(video) {
        const permlink = this.videoID.toHexString();
        steem.broadcast.comment(
            this.key, // WIF
            '', // Leave parent author empty
            'dtube', // Main tag
            this.user, // Author
            permlink,//video.shareInfo.link || temp, // permlink
            video.title , // title
            video.shareInfo.body || '<h1>Test upload to Dtube and Steemit on node</h1>', // Body
            JSON.stringify({
                'video': {
                    'info': {
                        'title': video.title,
                        'snaphash': video.thumbnail,
                        'author': this.user,
                        'permlink': permlink,//video.shareInfo.link || temp,
                        'duration': video.data.duration || '',
                        'filesize': video.ipfs._240.size || '',
                        'spritehash': ''
                    },
                    'content': {
                        'videohash': video.ipfs._240 !== null ? video.ipfs._240.hash || '':'',
                        // 'video480hash': video.ipfs._480.hash !== null ? video.ipfs._480.hash || '':'',
                        // 'video720hash': video.ipfs._720.hash !== null ? video.ipfs._720.hash || '':'',
                        // 'video1080hash': video.ipfs._1080.hash !== null ? video.ipfs._1080.hash || '':'',
                        'description': video.shareInfo.description || '',
                        'tags': video.shareInfo.tags || []
                    },
                    '_id': md5(permlink)
                },
                tags: video.shareInfo.tags || [],
                app: 'simple.scheduler.io'
            }), // Json Metadata
            async (err, result) => {
                if (err) {
                    console.log(`ERR -> ${err}`);
                    await this.sendLog('error', err);
                } else {
                    await this.sendLog('log', result);
                    await DBClient.update({_id: this.videoID}, {$set: {completed: true}}, 'videos');
                }
                await this.endProcess();
            }
        );
    }

}
