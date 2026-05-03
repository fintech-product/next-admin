'use client'

import { ReactNode } from "react"

interface Props {
  type?: string
  id?: string
  name?: string
  dataType?: string
  className?: string
  pattern?: string
  defaultValue?: string | number
  placeholder?: string
  required?: boolean
  maxLength?: number
  min?: string | number
  max?: string | number
  readOnly?: boolean
  error?: string
  children?: ReactNode
}
export default function Input({ type, id, name, dataType, className, pattern, defaultValue, placeholder, maxLength, min, max, required, readOnly, error, children }: Props) {
  return (
    <input
        type={type}
        id={id}
        name={name}
        className={className}
        pattern={pattern}
        data-type={dataType}
        data-error={error}
        defaultValue={defaultValue}
        maxLength={maxLength}
        min={min}
        max={max}
        readOnly={readOnly}
        required={required}
        placeholder={placeholder}
      >{children}</input>
  );
}
export function removeSeparators(input?: string | null): string {
  if (!input) return ""

  const len = input.length
  const buffer = new Array<string>(len)
  let write = 0

  for (let i = 0; i < len; i++) {
    const c = input[i]

    // skip unwanted characters
    if (
      c === " " || // normal space
      c === "\u00A0" || // non-breaking space
      c === "," ||
      c === "." ||
      c === "٬" || // Arabic thousands separator
      c === "$" ||
      c === "€" ||
      c === "£" ||
      c === "¥"
    ) {
      continue
    }

    buffer[write++] = c
  }

  // Avoid creating a large intermediate array via slice
  return write === len ? input : buffer.slice(0, write).join("")
}
export function formatInteger(v?: number | null, groupSeparator: string = ","): string {
  if (v == null || !Number.isFinite(v)) {
    return ""
  }

  const isNegative = v < 0
  let n = Math.abs(Math.trunc(v))

  // Fast path for small numbers (no separator needed)
  if (n < 1000) {
    return isNegative ? `-${n}` : `${n}`
  }

  let result = ""
  let count = 0

  while (n > 0) {
    const digit = n % 10
    n = (n / 10) | 0 // faster floor for positive integers

    if (count > 0 && count % 3 === 0) {
      result = groupSeparator + result
    }

    result = digit + result
    count++
  }

  return isNegative ? `-${result}` : result
}
export function formatNumber(v?: number | null, scale?: number, d?: string | null, g?: string): string {
  if (v == null) {
    return ""
  }
  if (!d && !g) {
    g = ","
    d = "."
  } else if (!g) {
    g = d === "," ? "." : ","
  }
  const s = scale === 0 || scale ? v.toFixed(scale) : v.toString()
  const x = s.split(".", 2)
  const y = x[0]
  const arr: string[] = []
  const len = y.length - 1
  for (let k = 0; k < len; k++) {
    arr.push(y[len - k])
    if ((k + 1) % 3 === 0) {
      arr.push(g)
    }
  }
  arr.push(y[0])
  if (x.length === 1) {
    return arr.reverse().join("")
  } else {
    return arr.reverse().join("") + d + x[1]
  }
}
