import { db } from "@lib/db"
import { UseCase } from "onecore"
import { Country, CountryFilter, CountryRepository, CountryService } from "./country"
import { SqlCountryRepository } from "./repository"
export * from "./country"

export class CountryUseCase extends UseCase<Country, string, CountryFilter> implements CountryService {
  constructor(repository: CountryRepository) {
    super(repository)
  }
}

let service: CountryService | undefined
export function getCountryService(): CountryService {
  if (!service) {
    const repository = new SqlCountryRepository(db)
    service = new CountryUseCase(repository)
  }
  return service
}
