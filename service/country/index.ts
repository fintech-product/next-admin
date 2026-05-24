import { db } from "@lib/db"
import { UseCase } from "onecore"
import { DB, Repository } from "sql-core"
import { Country, CountryFilter, CountryRepository, CountryService, countryModel } from "./country"
export * from "./country"

export class SqlCountryRepository extends Repository<Country, string, CountryFilter> implements CountryRepository {
  constructor(db: DB) {
    super(db, "country", countryModel)
  }
}
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
