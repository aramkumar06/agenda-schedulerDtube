import {Injectable} from '@angular/core';
import {Account} from '../models';
import * as steem from 'steem';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {
  // MARK: Static Properties
  private static base = 'api/auth/';

  // MARK: Properties
  private _acc = new BehaviorSubject<Account>(null);
  protected set acc(value: any) { this._acc.next(value); }
  protected get acc() { return this._acc.value; }
  public $acc = this._acc.asObservable();

  private _followInfo = new BehaviorSubject<{followers: number, follows: number}>(null);
  public followInfo$ = this._followInfo.asObservable();

  // MARK: Initialization
  constructor(private http: HttpClient) {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    this.getAccByTokenInfo();
  }

  // MARK: Public Methods
  public logIn(acc: Account) {
    return this.http.post<{token: any, acc: Account}>(AuthService.base, {acc: acc}).pipe(
      tap( data => {
        localStorage.setItem('token', data.token);
        this.acc = data.acc;
        this.getFollowInfo();
      })
    );
  }

  public getCurrentAccount() {
    return this.acc;
  }

  public getAccByTokenInfo() {
    this.http.get<Account>(AuthService.base)
      .subscribe(acc => this.acc = acc);
  }

  public isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /// Public Static methods
  public static logOut() { localStorage.removeItem('token'); }


  // MARK: Private Methods
  private getFollowInfo() {
    steem.api.getFollowCount(this.acc.username, (err: any, result: any) => {
      if (err) return;
      this._followInfo.next({followers: result['follower_count'],
        follows: result['following_count']})
    });
  }
}
