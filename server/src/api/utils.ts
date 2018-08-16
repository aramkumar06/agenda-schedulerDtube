import {StatusMessages, Error} from "./error";
import * as steem from 'steem';
import * as jwt from 'jsonwebtoken';

export function hasValidToken(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers.authorization;
    // decode token
    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {
            if (err) { return res.status(498).send(new Error(StatusMessages._498));
            } else {
                req['decoded'] = decoded;
                next();
            }
        });
    } else { return res.status(498).send(new Error(StatusMessages._498)); }
}

export function userExists(req: any, res: any, next: any) {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    steem.api.getAccounts([req.body.acc.username], (err, result) => {
        if (err) return res.status(500).send(new Error(StatusMessages._500));
        try {
            const publicKey = result[0].posting.key_auths[0][0];
            const postKey = req.body.acc.postKey;
            steem.auth.wifIsValid(postKey, publicKey);
            req['publicKey'] = publicKey;
            next();
        } catch (err) { return res.status(401).send(new Error(StatusMessages._401)); }
    });
}

export function isValidAccount(req: any, res: any, next: any) {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    const token = req['decoded'];
    try {
        if (steem.auth.wifIsValid(token.info.postKey, token.info.publicKey)) {
            next();
        } else {
            return res.status(401).send(new Error(StatusMessages._401));
        }
    } catch (err) { return res.status(401).send(new Error(StatusMessages._401)); }
}

export function checkBody(req: any, res: any, next: any) {
    if (req.body === undefined) { return res.status(400).send(new Error(StatusMessages._400)); }
    if (Object.keys(req.body).length === 0) { return res.status(400).send(new Error(StatusMessages._400)); }
    next();
}

export function isValidAccountObject(req: any, res: any, next: any) {
    if (!req.body.acc || !req.body.acc.username || !req.body.acc.postKey) {
        return res.status(400).send(new Error(StatusMessages._400)); }
    next();
}

export function hasFiles(req, res, next) {
    if (!req.files) return res.status(400).send(new Error(StatusMessages._400));
    next();
}