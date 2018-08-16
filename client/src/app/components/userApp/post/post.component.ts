import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SchedulerService} from "../../../services";
import {Video} from "../../../models";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";
import {SnackbarService} from "../../../services/snackbar.service";

@Component({
  selector: 'app-post-editing',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  // MARK: Properties
  step = 0;
  video: Video = new Video('default', 'default');
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  tags: string[] = [];

  // MARK: Initialization
  constructor(private route: ActivatedRoute,
              private router: Router,
              private snackBar: SnackbarService,
              private schedulerService: SchedulerService) {
    route.params
      .subscribe(params => {
        this.video = schedulerService.getVideoPost(params.id);
        if (this.video === null || this.video === undefined) this.router.navigateByUrl('app/schedule');
        if (this.video) this.tags = this.video.shareInfo.tags;
      });
  }

  // MARK: Public methods
  public save() {
    this.schedulerService.editPost(this.video)
      .subscribe(
        success => {
          this.snackBar.show('Post info updated');
          this.router.navigate(['schedule'])
        },
            error => console.log(error)
        );
  }

  public previewBody() {
    let newWindow = window.open();
    newWindow.document.body.innerHTML = this.video.shareInfo.body;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (this.tags.indexOf(value.trim()) < 0) this.tags.push(value.trim());
    }
    if (input) input.value = '';
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) this.tags.splice(index, 1);
  }

  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
