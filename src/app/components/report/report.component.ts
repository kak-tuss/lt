import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UserExtended } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnChanges, OnInit {
  @Input() rootUsername: string = '';
  @Input() reportLevel: boolean = false;

  reportData: UserExtended[] = [];

  currentSort: keyof UserExtended | null = null;
  currentDirection: boolean = true;

  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.currentSort = null;
  }

  ngOnChanges(): void {
    this.getReport();
  }

  getSortClass(by: keyof UserExtended): string {
    if (this.currentSort === by) {
      return this.currentDirection ? 'asc' : 'desc';
    } else {
      return '';
    }
  }

  getReport(): void {
    console.log('Getting report for', this.rootUsername, ' level', this.reportLevel? '2' : '1');

    if (this.reportLevel) {
      console.log('Getting level 2 report');
      console.log(this.usersService.getFollowersWithRating(this.rootUsername));
      this.reportData = this.usersService.getFollowersWithRating(this.rootUsername);
    } else {
      console.log('Getting level 1 report');
      console.log(this.usersService.getExtendedFollowers(this.rootUsername));
      this.reportData = this.usersService.getExtendedFollowers(this.rootUsername);
    }
  }

  sort(by: keyof UserExtended): void {
    alert('Sorting by ' + by);
    if (this.currentSort === by) {
      this.currentDirection = !this.currentDirection;
      this.reportData = this.reportData.reverse();
      return;
    }

    this.currentSort = by;
    this.currentDirection = true;
    this.reportData = this.reportData.sort((a: UserExtended, b: UserExtended) => {
      return (
        (a[by as keyof UserExtended] ?? '') > (b[by as keyof UserExtended] ?? '') ? -1 : 1
      );
    });
  }
}
