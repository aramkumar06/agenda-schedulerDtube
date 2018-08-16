import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string) { this.openSnackBar(message); }

  private openSnackBar(message: string, action = '', duration = 2000) {
    this.snackBar.open(message, action, {duration: duration});
  }
}
