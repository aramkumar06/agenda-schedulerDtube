import {Component} from "@angular/core";
import {Job, LogRun, Video} from "../../../models";
import {AuthService, SchedulerService, LogsService, UploadService} from "../../../services";
import {Router} from "@angular/router";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // MARK: Properties


  // MARK: Initialization
  constructor(private cronService: SchedulerService,
              private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private uploadService: UploadService,
              private router: Router) {
    iconRegistry.addSvgIcon('run_loading',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/three-dots.svg'));

  }

  // MARK: Public methods


//   this.dialogService.showDialogWithYesNo({title: `Cancel`,
//   message: 'Do you want to cancel this job ? Have in mind that logs will also be deleted.'})
// .subscribe((result) => {
//   if (result) {
//     this.cronService.cancelJob()
//
//   }
// });
}
