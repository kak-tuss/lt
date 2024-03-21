import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { usersMock } from 'src/app/mocks/users-response';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  username: string = 'octocat';
  reportLevel: number = 1;
  showReport: boolean = false;
  availableUsers: User[] = usersMock

  constructor() { }
  updateUser(username: string): void {
    this.username = username;
  }
}
