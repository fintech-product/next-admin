import { db } from "@lib/db"
import { UseCase } from "onecore"
import { Locale, LocaleFilter, LocaleRepository, LocaleService } from "./locale"
import { SqlLocaleRepository } from "./repository"
export * from "./locale"

export class LocaleUseCase extends UseCase<Locale, string, LocaleFilter> implements LocaleService {
  constructor(repository: LocaleRepository) {
    super(repository)
  }
}

let service: LocaleService | undefined
export function getLocaleService(): LocaleService {
  if (!service) {
    const repository = new SqlLocaleRepository(db)
    service = new LocaleUseCase(repository)
  }
  return service
}
