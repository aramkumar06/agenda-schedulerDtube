import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {IPFSData, Scheduling, Uploading, Video} from "../models/";
import {HttpClient, HttpEventType} from "@angular/common/http";
import {map} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {SchedulerService} from "./scheduler.service";
import {SnackbarService} from "./snackbar.service";

@Injectable()
export class UploadService {
  // MARK: Static Properties
  private static base = 'api/upload/';

  // MARK: Properties
  /// Currently uploading to server
  private _uploading = new BehaviorSubject<Uploading>({});
  private get uploading() { return this._uploading.value; }
  private set uploading(value: Uploading) { this._uploading.next(value); }
  public $uploading = this._uploading.asObservable().pipe(map(data => Object.values(data)));

  /// Currently uploading to ipfs
  private _ipfsUploading = new BehaviorSubject<Uploading>({});
  private get ipfsUploading() { return this._ipfsUploading.value; }
  private set ipfsUploading(value: Uploading) { this._ipfsUploading.next(value); }
  public $ipfsUploading = this._ipfsUploading.asObservable().pipe(map(data => Object.values(data)));

  // MARK: Initialization
  constructor(private http: HttpClient,
              private snackBar: SnackbarService,
              private schedulerService: SchedulerService) {}

  // MARK: Public methods
  public uploadVideos(videos: Video[]) {
    let currentVideos = this.uploading;
    videos.map(video => {
      const key = `${video.data.file.lastModified}${video.data.file.size}`;
      if (currentVideos[key] === undefined) {
        currentVideos[key] = {video: video, progress: 0};
        this.upload(key);
      }
    });
    this.uploading = currentVideos;
  }

  public isLimitReached() {
    return Object.keys(this.uploading).length > 4;
  }

  public isUploading() {
    return Object.keys(this.uploading).length > 0 || Object.keys(this.ipfsUploading).length > 0;
  }

  // MARK: Private Methods
  private upload(key: string) {
    const temp = this.uploading[key];
    let uploadData = new FormData();
    uploadData.append('video', temp.video.data.file, temp.video.title);
    this.http.post(`${UploadService.base}ipfs`, uploadData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          // This is an upload progress event. Compute and show the % done:
          const percentDone = Math.round(100 * event.loaded / event.total);
          temp.progress = percentDone;
          if (percentDone === 100) this.uploadToIPFS(key);
          break;
        case HttpEventType.Response:
          console.log(event.body[0]);
          this.updateDB(key, event.body as IPFSData);
          break;
      }
    }, err => console.log(err));
  }

  private updateDB(key: string, data: IPFSData) {
    let uploaded = this.ipfsUploading[key];
    uploaded.video.ipfs._240 = data;
    uploaded.video.data.file = null;
    delete uploaded.video._id;
    this.http.post<any>(UploadService.base, {video: uploaded.video})
      .subscribe(id => {
        uploaded.video._id = id;
        uploaded.video.uploaded = new Date();
        this.moveToSchedule(key, uploaded.video);
      });
  }

  // MARK: Protected methods
  protected moveToSchedule(key: string, uploaded: Video) {
    let currentIPFS = this.ipfsUploading;
    delete currentIPFS[key];
    this.ipfsUploading = currentIPFS;
    this.snackBar.show('Video uploaded succesfully.Find it on Schedule.');
    this.schedulerService.add(uploaded);
  }

  protected uploadToIPFS(key: string) {
    let currentUploading = this.uploading; //
    const data = currentUploading[key];
    delete currentUploading[key];
    this.uploading = currentUploading;
    let tempIPFS = this.ipfsUploading;
    tempIPFS[key] = data;
    this.ipfsUploading = tempIPFS;
  }
}
