// Express
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import path from "path";

// Swagger
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

// Security
import cors from "cors";
import helmet from "helmet";

// Logging
import Logger from "./Logger";

// Properties
import properties from "../properties.js";

// Controllers
import SecurityController from "../controllers/SecurityController";
import PythController from "../controllers/PythController";
import StakeController from "../controllers/StakeController";

// Start Import Controllers

// End Import Controllers

import { corsOptionsDelegate } from "../security/SecurityManager"

class Server {
	constructor() {
		this.app = express();
	}

	/**
	 * Start the server
	 * @returns {Promise<void>}
	 */
	async init() {
		Logger.info(
			"Zero Interest DeFi API Server"
		);

		// Add parser
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(Logger.expressMiddleware);

		// Securitiy
		this.app.use(helmet());
		// CORS setup
		this.app.use(cors(corsOptionsDelegate));

		// Swagger
		const swaggerDocument = yaml.load("./swagger.yaml");
		this.app.use(
			"/api/docs",
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument)
		);

		// Redirect frontend
		this.app.use("*", (req, res, next) => {
			if (req.originalUrl) {
				let url = req.originalUrl;
				if (!url.startsWith("/api/") && url.indexOf(".") == -1) {
					res
						.status(200)
						.sendFile(
							path.resolve(
								__dirname +
								"//..//" +
								properties.publicPath.replace(/\//g, "//") +
								"//index.html"
							)
						);
				} else {
					next();
				}
			} else {
				next();
			}
		});

		// Start App Server
		const server = http.Server(this.app);
		this.app.use(express.static(properties.publicPath));

		await server.listen(properties.port);
		Logger.info("Server started on port " + properties.port);
		Logger.info(
			"Swagger docs at http://localhost:" + properties.port + "/api/docs"
		);

		// Import controllers
		const router = express.Router();
		SecurityController.init(router);
		PythController.init(router);
		StakeController.init(router);
		// End Init Controllers

		this.app.use("/", router);
	}
}

export default new Server();\
