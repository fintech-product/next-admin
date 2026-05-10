import { Log } from "onecore"
import { DB, SearchBuilder, useGet } from "sql-core"
import { AuditLog, AuditLogFilter, auditLogModel } from "./audit-log"
export * from "./audit-log"

export function useAuditLogController(log: Log, db: DB) {
  const builder = new SearchBuilder<AuditLog, AuditLogFilter>(db, "audit_logs", auditLogModel)
  const getAuditLog = useGet<AuditLog, string>(db, "audit_logs", auditLogModel)
  return getAuditLog
  // return new AuditLogController(builder.search);
}
