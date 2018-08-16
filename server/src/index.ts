import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import * as path from "path";
import { apiRouter } from './api';
import { appMiddleware, errorHandler } from './middleware';
import logger from './util/logger';
import {StatusMessages, Error} from "./api/error";

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api', apiRouter);

app.use(express.static(__dirname + '../../../../client/dist/'));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'../../../../client/dist/index.html'));
});
app.use(errorHandler);

export default app;