import { Request, Response } from "express";
import { DefaultResponse } from "../models/dto/default";
import { LoginRequest, RegisterRequest } from "../models/dto/auth";
import AuthService from "../services/auth";
import { isErrorType } from "../utils/checker";

class AuthHandler {
  async login(req: Request, res: Response) {
    const payload: LoginRequest = req.body;

    const loginResponse = await AuthService.login(payload);

    if (isErrorType(loginResponse)) {
      const response: DefaultResponse = {
        status: "BAD_REQUEST",
        message: loginResponse.message,
        data: null,
      };

      res.status(loginResponse.httpCode).send(response);
    } else {
      const response: DefaultResponse = {
        status: "ok",
        message: "User Berhasil Login",
        data: loginResponse,
      };

      res.status(200).send(response);
    }
  }

  async register(req: Request, res: Response) {
    const payload: RegisterRequest = req.body;

    if (!(payload.email && payload.password && payload.username)) {
      const response: DefaultResponse = {
        status: "BAD_REQUEST",
        message: "Email, Password, Username Tidak Boleh Kosong",
        data: {
          registered_user: null,
        },
      };

      return res.status(400).send(response);
    }

    const registeredUser = await AuthService.register(payload);

    if (isErrorType(registeredUser)) {
      const response: DefaultResponse = {
        status: "BAD_REQUEST",
        message: registeredUser.message,
        data: null,
      };

      res.status(registeredUser.httpCode).send(response);
    } else {
      const response: DefaultResponse = {
        status: "CREATED",
        message: "User Berhasil Ditambahkan",
        data: {
          registered_user: registeredUser,
        },
      };

      res.status(201).send(response);
    }
  }

  async getLoggedInUser(req: Request, res: Response) {
    const response: DefaultResponse = {
      status: "OK",
      message: "User logged in succesfully",
      data: {
        user: req.user,
      },
    };

    res.status(200).send(response);
  }

  async loginGoogle(req: Request, res: Response) {
    const googleAccessToken = req.query.access_token as string;
    const loginGoogleResponse = await AuthService.loginGoogle(
      googleAccessToken
    );

    if (isErrorType(loginGoogleResponse)) {
      const response: DefaultResponse = {
        status: "BAD_REQUEST",
        message: loginGoogleResponse.message,
        data: null,
      };

      res.status(loginGoogleResponse.httpCode).send(response);
    } else {
      const response: DefaultResponse = {
        status: "OK",
        message: "User logged in succesfully",
        data: loginGoogleResponse,
      };

      res.status(200).send(response);
    }
  }
}

export default AuthHandler;
