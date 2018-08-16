import {Error, StatusMessages} from "../error";

const jwt = require('jsonwebtoken');

import { Router } from 'express';
import logger from "../../util/logger";
import DBClient from "../../database/dbClient";
import {checkBody, hasValidToken, isValidAccount, isValidAccountObject, userExists} from "../utils";
const ObjectId = require('mongodb').ObjectID;

let router = Router();

router.post('/', checkBody, isValidAccountObject, userExists, async (req, res) => {
    const acc = req.body.acc;
    try {
        let result = await DBClient.findOne({username: acc.username}, 'users');
        if (!result) {
            const publicKey = req['publicKey'];
            const temp = await DBClient.insertOne({username: acc.username, postKey: acc.postKey, publicKey: publicKey}, 'users');
            result = temp['ops'][0];
        }
        const tokenInfo = { username: result.username, postKey: result.postKey, publicKey: result.publicKey};
        const token = await jwt.sign({ info: tokenInfo}, 'secret', {expiresIn: 7200});
        res.status(200).send({token: token, acc: tokenInfo});
    } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.get('/', hasValidToken, isValidAccount, async (req, res) => {
   try {
       const acc = req['decoded'].info;
       res.status(200).send(acc);
   } catch (error) { res.status(500).send(new Error(StatusMessages._500))}
});

export let authRouter = router;
