import SafeError from "./SafeError";
import ValueAlreadyUsedError from "./ValueAlreadyUsedError";
import Logger from "./Logger";

export class ErrorManager {
  constructor() { }

  getSafeError(err) {
    Logger.error(err.stack);
    if (err instanceof SafeError) {
      return err;
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      return new ValueAlreadyUsedError(err.fields)
    }

    // create a safe, generic error message to always return
    return new SafeError({});
  }

  generateSafeTransferError(name, err) {
    return new SafeError({ status: 400, name: name, message: err.toString() })
  }
}

export default new ErrorManager();
