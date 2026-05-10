"use client"

import { FocusEvent, FocusEventHandler, ReactNode } from "react"
import { addClass, addErrorMessage, getContainer, isValidPattern, removeClasses, removeError } from "./client-script"

interface Props {
  type?: string
  id?: string
  name?: string
  dataType?: string
  className?: string
  pattern?: string
  defaultValue?: string | number
  value?: string | number
  placeholder?: string
  required?: boolean
  requiredError?: string
  error?: string
  maxLength?: number
  min?: string | number
  max?: string | number
  readOnly?: boolean
  children?: ReactNode
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
}
export default function Input({
  type,
  id,
  name,
  dataType,
  className,
  defaultValue,
  value,
  placeholder,
  required,
  requiredError,
  pattern,
  error,
  maxLength,
  min,
  max,
  readOnly,
  children,
  onBlur,
  onFocus,
}: Props) {
  const onFocusFn = onFocus ? onFocus : materialOnFocus
  const onBlurFn = onBlur ? onBlur : (e: FocusEvent<HTMLInputElement>) => checkOnBlur(e, required, requiredError, pattern, error)
  return (
    <input
      type={type}
      id={id}
      name={name}
      className={className}
      pattern={pattern}
      data-type={dataType}
      data-error={error}
      data-required-error={requiredError}
      defaultValue={defaultValue}
      value={value}
      maxLength={maxLength}
      min={min}
      max={max}
      readOnly={readOnly}
      required={required}
      placeholder={placeholder}
      onFocus={onFocusFn}
      onBlur={onBlurFn}
    >
      {children}
    </input>
  )
}

export function checkOnBlur(e: FocusEvent<HTMLInputElement>, required?: boolean, requiredError?: string, patern?: string, paternError?: string) {
  materialOnBlur(e)
  const input = e.target
  removeError(input)
  if (required) {
    const err = requiredError ? requiredError : "Required field"
    checkRequired(e, err, patern, paternError)
  } else {
    debugger
    if (patern) {
      console.log("patern " + patern)
      if (!isValidPattern(input.value, patern)) {
        const error = paternError ? paternError : "Pattern Error"
        addErrorMessage(input, error)
        return
      }
    }
    removeError(input)
  }
}
export function checkRequired(e: FocusEvent<HTMLInputElement>, msg: string, patern?: string, paternError?: string) {
  materialOnBlur(e)
  const input = e.target
  removeError(input)
  if (input.value === "") {
    addErrorMessage(input, msg)
  } else {
    if (patern) {
      if (!isValidPattern(input.value, patern)) {
        const error = paternError ? paternError : "Pattern Error"
        addErrorMessage(input, error)
        return
      }
    }
    removeError(input)
  }
}

export function inputOnFocus(e: FocusEvent<HTMLInputElement>) {
  removeError(e.target)
}
export function requiredOnFocus(e: FocusEvent<HTMLInputElement>) {
  removeError(e.target)
}
export function materialOnFocus(e: FocusEvent<HTMLInputElement>) {
  const ele = e.currentTarget as HTMLInputElement
  if (ele.disabled || ele.readOnly) {
    return
  }
  setTimeout(() => {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      addClass(getContainer(ele), "focused")
    }
  }, 0)
}
export function materialOnBlur(e: FocusEvent<HTMLInputElement>): void {
  const ele = e.currentTarget as HTMLInputElement
  setTimeout(() => {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      removeClasses(getContainer(ele), ["focused", "focus"])
    }
  }, 0)
}
