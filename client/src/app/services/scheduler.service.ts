import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job, Account, MyJob, Video, Scheduling} from "../models";
import {BehaviorSubject} from "rxjs";
import {filter, map, tap} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {SocketService} from "./socket.service";
import {UploadService} from "./upload.service";
import {SnackbarService} from "./snackbar.service";

@Injectable()
export class SchedulerService {
  private static base = 'api/schedule/';

  // MARK: Properties
  /// Uploaded
  private _scheduling = new BehaviorSubject<Scheduling>({});
  private get scheduling() { return this._scheduling.value; }
  private set scheduling(value: Scheduling) { this._scheduling.next(value); }
  public $scheduling = this._scheduling.asObservable().pipe(map(data => Object.values(data)));

  // MARK: Initialization
  constructor(private http: HttpClient,
              private authService: AuthService,
              private snackBar: SnackbarService,
              private socketService: SocketService) {
    authService.$acc.subscribe(acc => this.getUploadedVideos());
  }

  // MARK: Private methods
  private getUploadedVideos() {
    this.http.get<Scheduling>(`api/upload/`)
      .subscribe(videos => this.scheduling = videos)
  }

  private scheduleVideo(id, date) {
    return this.http.patch(`${SchedulerService.base}`, {_id: id, date: date});
  }

  // MARK: Public methods
  public getVideoPost(id: string) {
    return this.scheduling[id];
  }

  public editPost(video: Video) {
    return this.http.put(SchedulerService.base, {video: video})
  }

  public deletePost(id: string) {
    this.http.delete(`${SchedulerService.base}${id}`)
      .subscribe(success => {
        this.remove(id);
        this.snackBar.show('Post removed');
      });
  }

  public add(video: Video) {
    let temp = this.scheduling;
    temp[video._id] = video;
    this.scheduling = temp;
  }

  public remove(id: string) {
    let temp = this.scheduling;
    delete temp[id];
    this.scheduling = temp;
  }

  public schedule(id: string, date: Date) {
    let video = this.scheduling[id];
    this.scheduleVideo(id, date)
      .subscribe((success) => {
        this.snackBar.show(`INFO Updated !`);
        video.scheduled = date;
        video.completed = false;
        this.add(video);
      })
  }

}
