// Dependencies
import jsonwebtoken from "jsonwebtoken";
import cors from "cors";
import helmet from "helmet";
// Properties
import properties from "../properties";
// Errors
import ErrorManager from "../classes/ErrorManager";
import Errors from "../classes/Errors";
import * as ROLE from  "../utils/roles";

/**
 * Middleware JWT
 * @param {string, array} roles Authorized role, null for all
 */
export const authorize = (roles = []) => {
  // Roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // Authenticate JWT token and attach user to request object (req.user)
    async (req, res, next) => {

      if (!req.headers.authorization) {
        const safeErr = ErrorManager.getSafeError(
          new Errors.INVALID_AUTH_HEADER()
        );
        res.status(safeErr.status).json(safeErr);
      } else {
        console.log('SecurityManager.authorize authorization = ', req.headers.authorization);
        let token = req.headers.authorization.replace("Bearer ", "");
        let decodedUser = null;
        try {
          decodedUser = jsonwebtoken.verify(token, properties.tokenSecret);
          if (isUserAnon(decodedUser)) {
            decodedUser.roles.push(ROLE.ANON)
          }
          console.log('decodedUser: ', decodedUser)
        } catch (err) {
          // Token not valid
          const safeErr = ErrorManager.getSafeError(new Errors.JWT_INVALID());
          return res.status(safeErr.status).json(safeErr);
        }

        if (decodedUser && hasRole(roles, decodedUser)) {
          req.user = decodedUser;
          next();
        } else {
          const safeErr = ErrorManager.getSafeError(new Errors.UNAUTHORIZED());
          res.status(safeErr.status).json(safeErr);
        }
      }
    }
  ];
};

export const initSecurity = app => {
  app.use(helmet());
  app.use(cors());
};

// ---------------- UTILS FUNCTIONS ---------------- //

/**
 * Check if user has role
 * @param {*} roles String or array of roles to check
 * @param {*} user Current logged user
 */
var hasRole = function(roles, user) {
  return (
    roles == undefined ||
    (user != undefined && roles.length == 0) ||
    (user != undefined && roles.indexOf("PUBLIC") != -1) ||
    (user != undefined && user.roles.indexOf(ROLE.ADMIN) != -1) ||
    (user != undefined && findOne(roles, user.roles))
  );
};

/**
 * Find value in array
 * @param {*} array1
 * @param {*} array2
 */
var findOne = function(array1, array2) {
  for (var i in array1) {
    for (var j in array2) {
      if (array1[i] == array2[j]) return true;
    }
  }

  return false;
};

/**
 * Delegate function to get the correct CORS option for URL
 *
 * @param {*} req - HTTP request
 * @param {*} callback - callback function
 */
export const corsOptionsDelegate = (req, callback) => {
  // First argument is for error
  // Second argument is the cors option to be used
  callback(null, getCorsOption(req.originalUrl));
}

/**
 * Get CORS option based on URL
 *
 * @param {*} url - HTTP request URL
 */
const getCorsOption = (url) => {
  const { azure, roks } = properties.corsOptions;
  const corsOption = { origin: "" };
  if (isAzureOriginCalledApi(url)){
    corsOption.origin = azure;
  } else {
    corsOption.origin = roks;
  }
  return corsOption;
}

/**
 * Check if URL is made by the ROKS Azure App
 *
 * @param {*} url - URL of the request
 */
const isAzureOriginCalledApi = (url) => {
  switch(url){
    case "/api/ethtransfer":
    case "/api/rokstransfer":
      return true;
    default: return false;
  }
}

/**
 * Checks if user is has ADMIN role
 *
 * @param {*} user
 */
export const isUserAdmin = (user) => {
  return hasRole([ROLE.ADMIN], user);
};

/**
 * Checks if user is has SENDER role
 *
 * @param {*} user 
 */
export const isUserSender = (user) => {
  return hasRole([ROLE.SENDER], user);
};

// check if user is anonymous
const isUserAnon = (user) => {
  return user.username === 'anonymous'
}
