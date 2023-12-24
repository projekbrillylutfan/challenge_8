import { LoginRequest, RegisterRequest } from "../models/dto/auth";
import { Auth } from "../models/entity/auth";
import { ErrorResponse } from "../models/entity/default";
import { User } from "../models/entity/user";
import UserRepository from "../repositories/userRepo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const SALT_ROUND = 10;

class AuthService {
  static async login(req: LoginRequest): Promise<Auth | ErrorResponse> {
    try {
      if (!req.email) throw new Error("email cannot be empty");
      if (!req.password) throw new Error("password cannot be empty");
      if (req.password.length < 8)
        throw new Error("password length should be more than 8");

      const user = await UserRepository.getUserByEmail(req.email);

      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      const isPasswordCorrect = bcrypt.compareSync(
        req.password,
        user.password as string
      );

      if (!isPasswordCorrect) {
        throw new Error("Password Salah!!!!!!!!!!");
      }

      const jwtSecret = "RAHASIAMUEHEHEH";
      const jwtExpireTime = "24h";

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        jwtSecret,
        {
          expiresIn: jwtExpireTime,
        }
      );

      const authToken: Auth = {
        access_token: token,
      };

      return authToken;
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        httpCode: 400,
        message: error.message,
      };

      return errorResponse;
    }
  }

  static async register(req: RegisterRequest): Promise<User | ErrorResponse> {
    try {
      const user = await UserRepository.getUserByEmail(req.email);

      if (user) {
        throw new Error("user sudah ada");
      } else {
        const ecryptedPassword = bcrypt.hashSync(req.password, SALT_ROUND);

        const userToCreate: User = {
          username: req.username,
          email: req.email,
          password: ecryptedPassword,
          role: "member",
        };
        const createdUser = await UserRepository.createUserRegister(
          userToCreate
        );

        return createdUser;
      }
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        httpCode: 400,
        message: error.message,
      };

      return errorResponse;
    }
  }

  static async loginGoogle(
    googleAccessToken: string
  ): Promise<Auth | ErrorResponse> {
    try {
      // Get google user credential
      const client = new OAuth2Client(
        "52535015285-0i182g0q4ccnv9q3i4dgnh7hiah779u3.apps.googleusercontent.com"
      );

      const userInfo: any = await client.verifyIdToken({
        idToken: googleAccessToken,
        audience:
          "52535015285-0i182g0q4ccnv9q3i4dgnh7hiah779u3.apps.googleusercontent.com",
      });

      const { email, name, picture } = userInfo.payload;

      // Check if email is exist
      const user = await UserRepository.getUserByEmail(email);

      if (!user) {
        // If the user doesn't exist, create a new user based on Google login response
        const newUser = {
          email: email,
          username: name,
          role: "member",
          // You can add other user properties based on your needs
        };

        // Save the new user to your database
        const createdUser = await UserRepository.createUser(newUser);

        // Generate token JWT for the new user
        const jwtSecret = "RAHASIAMUEHEHEH";
        const jwtExpireTime = "24h";

        const accessToken = jwt.sign(
          {
            id: createdUser.id,
            email: createdUser.email,
            username: createdUser.username,
          },
          jwtSecret,
          {
            expiresIn: jwtExpireTime,
          }
        );

        const token: Auth = {
          access_token: accessToken,
        };

        return token;
      }

      // Generate token JWT
      const jwtSecret = "RAHASIAMUEHEHEH";
      const jwtExpireTime = "24h";

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        jwtSecret,
        {
          expiresIn: jwtExpireTime,
        }
      );

      const token: Auth = {
        access_token: accessToken,
      };

      return token;
    } catch (error: any) {
      // If something is wrong, return the error
      const errorResponse: ErrorResponse = {
        httpCode: 400,
        message: error.message,
      };

      return errorResponse;
    }
  }
}

export default AuthService;
