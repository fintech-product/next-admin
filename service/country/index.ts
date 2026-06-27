import { db } from "@lib/db"
import { CountryService } from "./country"
import { SqlCountryRepository } from "./repository"
import { CountryUseCase } from "./service"
export * from "./country"

let service: CountryService | undefined
export function getCountryService(): CountryService {
  if (!service) {
    const repository = new SqlCountryRepository(db)
    service = new CountryUseCase(repository)
  }
  return service
}
