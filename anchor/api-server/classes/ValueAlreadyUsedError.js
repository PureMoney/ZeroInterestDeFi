import ErrorMessages from "./ErrorMessages";

class ValueAlreadyUsedError extends Error {
  constructor(fields) {
    super();
    Error.captureStackTrace(this, this.constructor)
    this.name = ErrorMessages.VALUE_ALREADY_USED.name
    this.status = ErrorMessages.VALUE_ALREADY_USED.status
    this.message = this.getMessage(fields)
  }
  getMessage(fields) {
    let keys = []
    Object.keys(fields).forEach((key) => {
      keys.push(key.replace("user.", ""))
    })
    let columns = keys.toString()
    // Capitalize the first letter
    columns  = columns.charAt(0).toUpperCase() + columns.slice(1)
    return `${columns} already exists - cannot register duplicate.`
  }
}

export default ValueAlreadyUsedError