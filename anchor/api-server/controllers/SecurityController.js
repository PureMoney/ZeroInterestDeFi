// Properties
import Properties from "../properties";

// Security
import { authorize, isUserAdmin } from "../security/SecurityManager";
import jsonwebtoken from "jsonwebtoken";

// Errors
import ErrorManager from "../classes/ErrorManager";
import Errors from "../classes/Errors";

const securityControllers = {
  /**
   * Init routes
   */
  init: router => {
    const baseUrl = `${Properties.api}`;
    router.post(baseUrl + "/login", securityControllers.login);
    router.post(baseUrl + "/verifyToken", securityControllers.verifyToken);
    router.post(
      baseUrl + "/changePassword",
      authorize(),
      securityControllers.changePassword
    );
  },

  /**
   * Login function
   *
   */
  login: async (req, res) => {
    try {
      // Get parameters from post request
      let params = req.body;
      // Retrieve user
      let user = await UserModel.getByUsernameAndPassword(
        params.username,
        params.password
      );
      if (user) {
        // Create token
        const isAdmin = isUserAdmin(user);
        var token = jsonwebtoken.sign(user, Properties.tokenSecret, {
          expiresIn: isAdmin? 3600: 10800 // If user is admin, expire token in 3600 seconds. If not (non-admin), 3 hours.
        });
        user.token = token;
        user.password = undefined;
        // Get userextension data for the user
        const userExtension = await UserExtModel.getByFK_User(user._id);
        if (userExtension){
          // Set Bloom and PrimeTrust IDs if available
          user.BloomId = userExtension.dataValues.BloomId;
          user.PrimeTrustContactId = userExtension.dataValues.PrimeTrustContactId;
          user.CryptoAddress = userExtension.dataValues.CryptoAddress;
        }
        res.send(user);
      } else {
        // Error login
        throw new Errors.INVALID_LOGIN();
      }
    } catch (err) {
      const safeErr = ErrorManager.getSafeError(err);
      res.status(safeErr.status).json(safeErr);
    }
  },

  /**
   * Verify JWT Token function
   *
   */
  verifyToken: async (req, res) => {
    try {
      let token = req.body.token;
      if (token) {
        let decoded = null;
        try {
          decoded = jsonwebtoken.verify(token, Properties.tokenSecret);
        } catch (err) {
          return res.json({
            success: false,
            mesage: "Failed to authenticate token"
          });
        }

        res.json(decoded);
      } else {
        throw new Errors.NO_TOKEN();
      }
    } catch (err) {
      const safeErr = ErrorManager.getSafeError(err);
      res.status(400).json(safeErr);
    }
  },

  /**
   * Change password for current user
   *
   */
  changePassword: async (req, res) => {
    try {
      // Retrieve user
      let user = await UserModel.getByUsernameAndPassword(
        req.user.username,
        req.body.passwordOld
      );
      if (!user) {
        throw new Errors.OLD_PWD_NOT_VALID();
      }

      await UserModel.updatePassword(req.user._id, req.body.passwordNew);
      res.json({
        success: true
      });
    } catch (err) {
      const safeErr = ErrorManager.getSafeError(err);
      res.status(400).json(safeErr);
    }
  }
};

export default securityControllers;
