import { db } from "@lib/db"
import { Rate, SearchResult } from "onecore"
import { Article, ArticleFilter, ArticleRepository, ArticleService } from "./article"
import { SqlArticleRepository, SqlRateSummaryRepository } from "./repository"
export * from "./article"

import { nanoid } from "nanoid"
import { SavedRepository } from "onecore"
import { SqlSavedRepository } from "pg-extension"
import { SqlRateRepository } from "rate-sql"
import { buildToInsert, buildToUpdate } from "sql-core"
import { rateModel, RateSummary, RateSummaryRepository, zeroSummary } from "../shared/rate"
import { RateFilter, RatesRepository, Rate as SearchRate, SearchRateRepository } from "../shared/rates"

export class ArticleUseCase implements ArticleService {
  constructor(protected repository: ArticleRepository, protected savedRepository: SavedRepository<string, string>, protected max: number, protected rateSummaryRepository: RateSummaryRepository, protected ratesRepository: RatesRepository) {
  }
  search(filter: ArticleFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Article>> {
    return this.repository.search(filter, limit, page, fields)
  }
  load(id: string, userId?: string): Promise<Article | null> {
    return this.repository.load(id, userId)
  }
  getIdBySlug(slug: string): Promise<string> {
    return this.repository.getIdBySlug(slug)
  }
  async getRateSummary(id: string): Promise<RateSummary> {
    let rateSummary = await this.rateSummaryRepository.load(id)
    return (rateSummary ? rateSummary : { ...zeroSummary, id})
  }
  async save(userId: string, id: string): Promise<number> {
    const count = await this.savedRepository.count(userId)
    if (count >= this.max) {
      return -1
    } else {
      return this.savedRepository.save(userId, id)
    }
  }
  remove(userId: string, id: string): Promise<number> {
    return this.savedRepository.remove(userId, id)
  }
  searchRates(filter: RateFilter, limit: number, page?: number | string, fields?: string[]): Promise<SearchResult<SearchRate>> {
    return this.ratesRepository.search(filter, limit, page, fields)
  }
}


let articleService: ArticleService | undefined
export function getArticleService(): ArticleService {
  if (!articleService) {
    const repository = new SqlArticleRepository(db)
    const savedRepository = new SqlSavedRepository(db, "saved_articles", "user_id", "id", "saved_at")
    const rateSummaryRepository = new SqlRateSummaryRepository(db)
    const ratesRepository = new SearchRateRepository(db)
    const rateRepository = new SqlRateRepository<Rate>(db, "article_rates", rateModel, 5, "article_info", buildToInsert, buildToUpdate, generateId, "rateId", "rate", "count", "score", "author", "id")
    articleService = new ArticleUseCase(repository, savedRepository, 200, rateSummaryRepository, ratesRepository)
  }
  return articleService
}
function generateId(): string {
  return nanoid(10)
}
