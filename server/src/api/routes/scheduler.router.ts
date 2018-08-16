import { Router } from 'express';
import agenda from '../../agenda/agenda';
import {Error, StatusMessages} from "../error";
import logger from "../../util/logger";
import DBClient from "../../database/dbClient";
import {checkBody} from "../utils";
import {JobData} from "../../agenda/agenda.model";
const ObjectId = require('mongodb').ObjectID;

let router = Router();

router.put('/', checkBody, async (req: any, res) => {
   let video = req.body.video;
   const acc = req['decoded'].info;
   const id = video._id;
   video._id = ObjectId(id);
   try {
       await DBClient.save(video, 'videos');
       const jobData: JobData = {username: acc.username, key: acc.postKey, id: id};
       await agenda.addJob(video.scheduled, 'post_scheduler_dtube', jobData);
       res.status(202).send();
   } catch (error) { return res.status(500).send(new Error(StatusMessages._500)); }
});

router.patch('/', checkBody, async (req: any, res) => {
    const id = req.body._id;
    const date = req.body.date;
    const acc = req['decoded'].info;
    const jobData: JobData = {username: acc.username, key: acc.postKey, id: id};
    try {
        const temp = await DBClient.findOne({_id: ObjectId(id)}, 'videos');
        if (temp === null) { return res.status(404).send(new Error(StatusMessages._404)); }
        await DBClient.updateOne({_id: ObjectId(id)}, {$set: {scheduled: date}}, 'videos');
        await agenda.addJob(date, 'post_scheduler_dtube', jobData); // TODO: Job ENUM needed for multiple jobs
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(new Error(StatusMessages._500)); }
});

router.delete('/:id', async (req, res) => {
   const id = req.params.id;
   try {
       await DBClient.deleteOne({_id: ObjectId(id)}, 'videos');
       res.status(200).send({});
   } catch(err) { res.status(500).send(new Error(StatusMessages._500)); }
});

export let schedulerRouter = router;
