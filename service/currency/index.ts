import { db } from "@lib/db"
import { CurrencyService } from "./currency"
import { SqlCurrencyRepository } from "./repository"
import { CurrencyUseCase } from "./service"
export * from "./currency"

let service: CurrencyService | undefined
export function getCurrencyService(): CurrencyService {
  if (!service) {
    const repository = new SqlCurrencyRepository(db)
    service = new CurrencyUseCase(repository)
  }
  return service
}
