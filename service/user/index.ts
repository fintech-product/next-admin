import { SearchResult } from "onecore"
import { FollowRepository } from "pg-extension"
import { User, UserFilter, UserRepository, UserService } from "./user"

export class UserUseCase implements UserService {
  constructor(private repository: UserRepository, private followRepository: FollowRepository<string>) {}
  search(filter: UserFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<User>> {
    return this.repository.search(filter, limit, page, fields)
  }
  load(id: string, userId?: string): Promise<User | null> {
    return this.repository.load(id, userId)
  }
  getIdBySlug(slug: string): Promise<string> {
    return this.repository.getIdBySlug(slug)
  }
  follow(id: string, target: string): Promise<number> {
    return this.followRepository.follow(id, target)
  }
  unfollow(id: string, target: string): Promise<number> {
    return this.followRepository.unfollow(id, target)
  }
  checkFollow(id: string, target: string): Promise<number> {
    return this.followRepository.checkFollow(id, target).then((result) => (result ? 1 : 0))
  }
}
