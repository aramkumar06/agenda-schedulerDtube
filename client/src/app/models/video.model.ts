import {Log} from "./log.model";

export class Video {
  constructor(
              public username: string,
              public title: string,
              public _id: any = null,
              public thumbnail: string = '',
              public data: VideoData = new VideoData(),
              public scheduled: Date = null,
              public shareInfo: ShareInfo = new ShareInfo(),
              public ipfs: IPFS = new IPFS(),
              public uploaded: Date = null,
              public logs: Log[] = [],
              public completed: boolean = false) {}
}

export class VideoData {
  constructor(public file: File = null,
              public duration: string = '',
              public size: string = '') {}
}

export class ShareInfo {
  constructor(public link: string = '',
              public body: string = '',
              public description: string = '',
              public tags: string[] = []) {}
}

export class IPFS {
  constructor(public _240: IPFSData = null,
              public _480: IPFSData = null,
              public _720: IPFSData = null,
              public _1080: IPFSData = null) {}
}

export interface IPFSData {
  path: string;
  hash: string;
  size: number;
}

export interface Scheduling { [key: string]: Video; }

export interface Uploading { [key: string]: UploadVideo; }
export interface UploadVideo {
  video: Video;
  progress: number;
}
