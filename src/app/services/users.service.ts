import { Injectable } from '@angular/core';
import { usersMock } from '../mocks/users-response';
import { followersMock } from '../mocks/followers-response';
import { User, UserExtended } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersStateMap: Map<string, UserExtended> = new Map<string, UserExtended>();

  constructor() { 
    usersMock.map((user: UserExtended) => {
      this.usersStateMap.set(user.login, user);
    });
  }

  getUser(username: string): UserExtended | undefined {
    return this.usersStateMap.get(username) || undefined;
  }

  getFollowers(username: string): User[] | [] {
     return (followersMock as any)[username] || [];
  }

  getExtendedFollowers(username: string): UserExtended[] | [] {
    let followers: User[] = this.getFollowers(username);
    return followers.map((follower: User) => {
      return this.getUser(follower.login) || follower as UserExtended;
    });
  }

  getFollowersWithRating(username: string): UserExtended[] {
    const followers = this.getFollowers(username);
    return followers.map((follower: User) => {
      const user = this.getUser(follower.login);
      if (!user) {
        return follower as UserExtended;
      }
      user.followersLevel2 = this.getRating(follower.login);
      return user;
    });
  }

  getRating(username: string): number {
    const user = this.getUser(username);
    if (!user) {
      console.log('User not found');
      return 0;
    }

    if (user.followersLevel2 !== undefined) { 
      console.log('Got rating for', username, 'from state!');
      return user.followersLevel2;
    }
    console.log('Calculating rating for', username, user.followersLevel2);

    const followersMap = new Map<string, number>();

    const followers = this.getFollowers(username);

    followers.map((follower: User) => {
      if (!followersMap.has(follower.login)) {
        followersMap.set(follower.login, 1);
      }
      const secondLevelFollowers = this.getFollowers(follower.login);
      secondLevelFollowers.map((secondLevelFollower: User) => {
        if (!followersMap.has(secondLevelFollower.login)) {
          followersMap.set(secondLevelFollower.login, 1);
        }
      });
    });

    user.followersLevel2 = followersMap.size;
    this.usersStateMap.set(username, user);
    return user.followersLevel2;
  }
}
