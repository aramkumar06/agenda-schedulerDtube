import {Component} from "@angular/core";
import {AuthService, UploadService} from "../../../services";
import {UploadVideo, Video} from "../../../models/";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  // MARK: Properties
  public formats = "video/mp4, .mp4, video/avi, .avi, video/mpeg, .mpeg, .mpg, video/3gpp, .3gp, .divx," +
    "video/x-flv, .flv, video/x-matroska, video/quicktime, .mov, audio/ogg, .ogg, video/webm, .webm, video/x-ms-wmv,.wmv";

  videosUploading: UploadVideo[];
  ipfsUploading: UploadVideo[];

  // MARK: Initialization
  constructor(private uploadService: UploadService, private authService: AuthService) {
    uploadService.$uploading.subscribe(data => this.videosUploading = data);
    uploadService.$ipfsUploading.subscribe(data => this.ipfsUploading = data);
  }

  // MARK: Public methods
  public handleFileInput(files: FileList) {
    const acc = this.authService.getCurrentAccount();
    if (files.length === 0) return;
    if (this.uploadService.isLimitReached()) return;
    if (files.length > 4 ) return;
    // TODO: Dialog informing of max simultan uploads limit
    const temp: Video[] = [];
    for (let idx = 0;idx < files.length;idx++) {
      const file = files.item(idx);
      let video = new Video(acc.username, file.name);
      video.data.file = file;
      temp.push(video);
    }
    this.uploadService.uploadVideos(temp);
  }
}
