import express, { Application } from "express";
import CarsHandler from "../src/handlers/carsHandler";
import uploadFileUtil from "../src/utils/uploadFile";
import fileUploadsCloudinary from "../src/utils/fileUploadsCloudinary";
import AuthHandler from "./handlers/auth";
import AuthMiddleware from "./middlewares/auth";
import UsersHandler from "./handlers/usersHandler";
import dotenv from 'dotenv';
import cors from 'cors'
// import UserRepository from "./repositories/userRepo";
import CarsRepository from "./repositories/carsRepo";
// import UsersService from "./services/usersService";
import CarServices from "./services/carsService";
// import AuthService from "./services/auth";
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

// const usersRepository = new UserRepository();
const carsRepossitory = new CarsRepository();

// const userService = new UsersService(usersRepository);
const carsServive = new CarServices(carsRepossitory);
// const authService = new AuthService(usersRepository);

const carsHandler = new CarsHandler(carsServive);
const userHandler = new UsersHandler();
const authHandler = new AuthHandler();

// API Cars
app.get(
  "/api/cars",
  carsHandler.getCars
);

app.get(
  "/api/cars/ready",
  AuthMiddleware.authenticate,
  carsHandler.getCarsReady
);

app.get(
  "/api/cars/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  carsHandler.getCarsById
);
app.post(
  "/api/cars",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  fileUploadsCloudinary.single("car_img"),
  carsHandler.createCar
);
app.put(
  "/api/cars/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  uploadFileUtil.single("car_img"),
  carsHandler.updateCarById
);
app.delete(
  "/api/cars/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  carsHandler.deleteCarById
);

// API auth
app.post("/api/auth/login", authHandler.login);
app.post("/api/auth/register", authHandler.register);
app.get(
  "/api/auth/me",
  AuthMiddleware.authenticate,
  authHandler.getLoggedInUser
);

// API Users
app.get(
  "/api/users",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  AuthMiddleware.authenticateSuperAdmin,
  userHandler.getUsersByUsername
);
app.get(
  "/api/users/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  AuthMiddleware.authenticateSuperAdmin,
  userHandler.getUsersById
);
app.post(
  "/api/users",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  AuthMiddleware.authenticateSuperAdmin,
  userHandler.createUser
);
app.put(
  "/api/users/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  AuthMiddleware.authenticateSuperAdmin,
  userHandler.updateUserById
);
app.delete(
  "/api/users/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.authenticateAdmin,
  AuthMiddleware.authenticateSuperAdmin,
  userHandler.deleteUserById
);

// google Auth
app.get("/api/auth/login/google", authHandler.loginGoogle);


export default app;
