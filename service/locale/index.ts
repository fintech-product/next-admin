import { db } from "@lib/db"
import { LocaleService } from "./locale"
import { SqlLocaleRepository } from "./repository"
import { LocaleUseCase } from "./service"
export * from "./locale"

let service: LocaleService | undefined
export function getLocaleService(): LocaleService {
  if (!service) {
    const repository = new SqlLocaleRepository(db)
    service = new LocaleUseCase(repository)
  }
  return service
}
