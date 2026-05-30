import { db } from "@lib/db"
import { UseCase } from "onecore"
import { Currency, CurrencyFilter, CurrencyRepository, CurrencyService } from "./currency"
import { SqlCurrencyRepository } from "./repository"
export * from "./currency"

export class CurrencyUseCase extends UseCase<Currency, string, CurrencyFilter> implements CurrencyService {
  constructor(repository: CurrencyRepository) {
    super(repository)
  }
}

let service: CurrencyService | undefined
export function getCurrencyService(): CurrencyService {
  if (!service) {
    const repository = new SqlCurrencyRepository(db)
    service = new CurrencyUseCase(repository)
  }
  return service
}
