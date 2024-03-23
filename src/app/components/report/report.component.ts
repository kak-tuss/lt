import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { UserExtended } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent {
  @Input() rootUsername: string = '';
  @Input() reportLevel: number = 1;

  reportCurrentPage$: Observable<UserExtended[]> = new Observable<UserExtended[]>();
  page$ = new BehaviorSubject<number>(1);
  pageSize: number = 2;
  currentPage: number = 1;
  totalPages: number = 0;
  
  currentSort: keyof UserExtended | null = null;
  currentDirection: boolean = true;


  constructor(private usersService: UsersService) {
    this.reportCurrentPage$ = this.page$.pipe(
      switchMap((page: number) => this.usersService
      .getFollowersWithBFSRatingSorted(this.rootUsername, 
                                       this.reportLevel, 
                                       this.currentSort ?? 'login',
                                       this.currentDirection)),
      tap((data) => this.setTotalPages(data.length)),
      map((data) => this.getOnePage(data))
    );
  }

  setTotalPages(totalResults: number): void {
    this.totalPages = Math.ceil(totalResults / this.pageSize);
  }

  getOnePage(data: UserExtended[]): UserExtended[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return data.slice(startIndex, endIndex);
  }

  pageChange(page: number): void {
    this.currentPage = page;
    this.page$.next(this.currentPage);
  }
  sort(by: keyof UserExtended): void {
    if (this.currentSort === by) {
      this.currentDirection = !this.currentDirection;
    } else {
      this.currentSort = by;
      this.currentDirection = true;
    }
    this.pageChange(this.currentPage);
  }
  getSortClass(by: keyof UserExtended): string {
    if (this.currentSort === by) {
      return this.currentDirection ? 'asc' : 'desc';
    } else {
      return '';
    }
  }
}
