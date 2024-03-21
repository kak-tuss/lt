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
  @Input() reportLevel: number = 1;

  private reportData: UserExtended[] = [];
  reportCurrentPage: UserExtended[] = [];

  currentSort: keyof UserExtended | null = null;
  currentDirection: boolean = true;

  currentPage: number = 1;
  pageSize: number = 2;
  totalPages: number = 0;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.currentSort = null;
    this.generateReportData();
  }

  ngOnChanges(): void {
    this.generateReportData();
  }

  generateReportData(): void {
    this.getReport();
    this.totalPages = Math.ceil(this.reportData.length / this.pageSize);
    this.currentPage = 1;
    this.reportCurrentPage =this.getReportPageData(this.currentPage);
  }

  getReport(): void {
    if (this.reportLevel === 2) {
      this.reportData = this.usersService.getFollowersWithRating(this.rootUsername);
    } else {
      this.reportData = this.usersService.getExtendedFollowers(this.rootUsername);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.reportCurrentPage = this.getReportPageData(this.currentPage);
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.reportCurrentPage = this.getReportPageData(this.currentPage);
    }
  }

  getReportPageData(page: number): UserExtended[] {
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.reportData.slice(start, end);
  }


  sort(by: keyof UserExtended): void {
    if (this.currentSort === by) {
      this.currentDirection = !this.currentDirection;
      this.reportData = this.reportData.reverse();
      return;
    }
    this.currentSort = by;
    this.currentDirection = true;
    this.reportData = this.reportData.sort((a: UserExtended, b: UserExtended) => {
      return (a[by as keyof UserExtended] ?? '') > (b[by as keyof UserExtended] ?? '') ? -1 : 1;
    });
  }

  getSortClass(by: keyof UserExtended): string {
    if (this.currentSort === by) {
      return this.currentDirection ? 'asc' : 'desc';
    } else {
      return '';
    }
  }


}
