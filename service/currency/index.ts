import { db } from "@lib/db"
import { UseCase } from "onecore"
import { DB, Repository } from "sql-core"
import { Currency, CurrencyFilter, currencyModel, CurrencyRepository, CurrencyService } from "./currency"
export * from "./currency"

export class SqlCurrencyRepository extends Repository<Currency, string, CurrencyFilter> implements CurrencyRepository {
  constructor(db: DB) {
    super(db, "currency", currencyModel)
  }
}
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
