import { Injectable } from '@angular/core';
import { usersMock } from '../mocks/users-response';
import { followersMock } from '../mocks/followers-response';
import { User, UserExtended } from '../interfaces/user.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersStateMap: Map<string, UserExtended> = new Map<string, UserExtended>();
  totalUsers: number = 0;
  constructor() { 
    usersMock.map((user: UserExtended) => {
      this.usersStateMap.set(user.login, user);
    });
    this.totalUsers = usersMock.length;
  }

  getUser(username: string): UserExtended | undefined {
    return this.usersStateMap.get(username) || undefined;
  }

  getUserFollowers(username: string): User[] | [] {
     return (followersMock as any)[username] || [];
  }

  getFollowersWithBFSRatingSorted(
    username: string, 
    level: number, 
    by: keyof UserExtended, 
    direction: boolean)
    : Observable<UserExtended[]> 
  {
    const followers = this.getUserFollowers(username);
    return of(followers
      .sort((a: UserExtended, b: UserExtended) => {
        if ((a[by] ?? '') > (b[by] ?? '')) return direction ? 1 : -1;
        if ((a[by] ?? '') < (b[by] ?? '')) return direction ? -1 : 1;
        return 0;
      })
      .map((follower: User) => {
        const user = this.getUser(follower.login);
        if (!user) {
          return follower as UserExtended;
        }
        user.rank = this.getDeepRatingBFS(follower.login, level);
        return user;
      }));
  }

  getDeepRatingBFS(username: string, levels: number = 1): number {
    let list: Set<string> = new Set();

    const getFollowers = (user: string, level: number): void => {
      if (level === 0) return;
      let userFollowers: string[] = this.getUserFollowers(user)
                        .map((follower: User) => follower.login);
      if (!userFollowers || userFollowers.length === 0) return;

      userFollowers.forEach((follower: string) => {
        list.add(follower);
        getFollowers(follower, level - 1);
      });
    }

    getFollowers(username, levels);
    return list.size;
  }
}
