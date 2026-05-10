import { UseCase } from "onecore"
import { DB, Repository } from "sql-core"
import { Locale, LocaleFilter, localeModel, LocaleRepository, LocaleService } from "./locale"
export * from "./locale"

export class SqlLocaleRepository extends Repository<Locale, string, LocaleFilter> implements LocaleRepository {
  constructor(db: DB) {
    super(db, "locale", localeModel)
  }
}
export class LocaleUseCase extends UseCase<Locale, string, LocaleFilter> implements LocaleService {
  constructor(repository: LocaleRepository) {
    super(repository)
  }
}

let service: LocaleService | undefined
export function getLocaleService(db: DB): LocaleService {
  if (!service) {
    const repository = new SqlLocaleRepository(db)
    service = new LocaleUseCase(repository)
  }
  return service
}
