///<reference path="../../../../../node_modules/@angular/animations/src/animation_metadata.d.ts"/>
import {Component, OnInit, ViewChild} from "@angular/core";
import {MyDataSource, MySimpleDataSource} from "../../../utils/tableGeneric";
import {MatDatepickerInputEvent, MatPaginator} from "@angular/material";
import {Video} from "../../../models/";
import {DialogService, SchedulerService, UploadService} from "../../../services";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ScheduleComponent implements OnInit{
  // MARK: ViewChild
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // MARK: Properties
  displayedColumns = ['completed', 'title', 'scheduled', 'uploaded'];
  dataSource: MySimpleDataSource<Video> | null;
  expandedElement: Video;
  tempDate: Date;

  // MARK: Initialization
  constructor(private router: Router,
              private uploadService: UploadService,
              private dialogService: DialogService,
              private schedulerService: SchedulerService) {}

  ngOnInit() {
    // this.dataSource = new MyDataSource<Video>(this.uploadService.$scheduling, this.paginator);
    this.dataSource = new MySimpleDataSource<Video>(this.schedulerService.$scheduling);
  }

  // MARK: Public methods
  scheduleFor(id: string) {
    if (!this.tempDate) { return; }
    console.log(id);
    this.schedulerService.schedule(id, this.tempDate);
  }

  editPost(id: string) {
    this.router.navigateByUrl(`app/edit/${id}`);
  }

  deletePost(id: string) {
    this.dialogService
      .showDialogWithYesNo({title: 'Remove Post', message: 'Are you sure you want to delete this post ?'})
      .subscribe((state) => {
        if (state) this.schedulerService.deletePost(id);
      });
  }
}
