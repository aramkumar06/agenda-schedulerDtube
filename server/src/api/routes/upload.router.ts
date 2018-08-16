import { Router } from 'express';
import logger from '../../util/logger';
import DBClient from '../../database/dbClient';
import IpfsClient from '../../ipfs/ipfsClient';
import {StatusMessages, Error} from '../error';
import {checkBody, hasFiles} from "../utils";

let router = Router();

router.post('/ipfs', hasFiles, async (req, res) => {
    const video = req['files'].video;
    try {
        let buffer = new Buffer(video.data);
        const vid = await IpfsClient.add(buffer);
        res.status(200).send(vid);
    } catch(err) { res.status(500).send(new Error(StatusMessages._500)); }
    // video.mv(__dirname+`../../../../../../client/dist/assets/tmp/${video.name}`, async (err) => {
    //     if (err) {
    //         logger.error(err);
    //         return res.status(500).send(new Error(StatusMessages._500)); }
    //     const tg = new ThumbnailGenerator({
    //             sourcePath: __dirname+`../../../../../../client/dist/assets/tmp/${video.name}`,
    //             thumbnailPath: __dirname+`../../../../../../client/dist/assets/tmp/`
    //         });
    //         tg.generateCb((err, result) => {
    //             console.log(err, result);
    //         });
    //         tg.generateGifCb((err, result) => {
    //             console.log(err, result);
    //             // '/full/path/to/video-1493133602092.gif'
    //         });
    // });
});

router.post('/', checkBody, async (req, res) => {
    const video = req.body.video;
   try {
       video.uploaded = new Date();
       const temp = await DBClient.insertOne(video, 'videos');
       res.status(200).send(temp['ops'][0]['_id']);
   } catch (err) {
       logger.error(err);
       res.status(500).send(new Error(StatusMessages._500));
   }
});

router.get('/', async (req, res) => {
   const token = req['decoded'].info;
   let result = {};
   try {
       const temp = await DBClient.find({username: token.username}, 'videos');
       temp.forEach((video, _i, _a) => {
           result[video['_id']] = video;
       });
       res.status(200).send(result);
   } catch (err) { res.status(500).send(new Error(StatusMessages._500)); }
});

export let uploadRouter = router;
