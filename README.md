# next-website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Architecture

### Architecture

![Architecture](https://cdn-images-1.medium.com/max/800/1*JDYTlK00yg0IlUjZ9-sp7Q.png)

Typing:
- onecore: standard interfaces/types, no implementation

Utilities:
- locale: (locale-service) contain 123 languages and 210 locales, include date format, decimal separator, number group separator, currency code, currency decimal separator... 
- logging: (logger-core) used for structure log, support 7 log level: trace, debug, info, warn, error, panic, fatal
- data validation: (validation-core) high performance, lightweight but feature-rich library for data validation
  - validate data by schema
  - support multi-languages
- web: (web-one) web utilities to
  - format data (date, number)
  - build a filter model from URL
  - Based on schema, build a JSON object from HTML FormData
 
Database:
- sql-core: standard sql library, which can work with Oracle, Postgres, MySQL, SQL Server, SQLite
  - CRUDRepository (like CRUDRepository of Spring)
  - Repository: CRUDRepository + Search Repository
  - Utilities:
    - Map data from database column name to JSON object field name
    - Paging, Sorting: from a raw SQL, build an SQL statement which contains paging and sorting
    - From data schema, build insert/update/"insert or update" SQL statement
    
Plug and Play features:
- authentication: (authen-service)
  - Can use with any database design
  - Has existing SQL Repository
  - Has existing authentication service