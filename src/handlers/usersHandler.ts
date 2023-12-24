import { Request, Response } from "express";
import { DefaultResponse } from "../models/dto/default";
import { User } from "../models/entity/user";
import UsersService from "../services/usersService";
import { UserRequest } from "../models/dto/user";
import { ErrorResponse } from "../models/entity/default";

class UsersHandler {
    async getUsersByUsername(req: Request, res: Response) {
        const queryName: string = req.query.name as string;
        const usersList: User[] = await UsersService.getUsersByUsername(queryName);
    
        if (usersList.length === 0) {
          const Response: DefaultResponse = {
            status: "ERROR",
            message: "Username not found",
            data: null,
          };
          return res.status(404).send(Response);
        }
        const response: DefaultResponse = {
          status: "OK",
          message: "Success retrieving data",
          data: {
            users: usersList,
          },
        };
    
        res.status(200).send(response);
      }

      async getUsersById(req: Request, res: Response) {
        const queryId: number = parseInt(req.params.id);
        const usersList: User[] = await UsersService.getUsersById(queryId);
    
        if (usersList.length === 0) {
          const Response: DefaultResponse = {
            status: "ERROR",
            message: "User not found",
            data: null,
          };
          return res.status(404).send(Response);
        }
        const response: DefaultResponse = {
          status: "OK",
          message: "Success retrieving data",
          data: {
            users: usersList,
          },
        };
        res.status(200).send(response);
      }

      async createUser(req: Request, res: Response) {
        const payload: UserRequest = req.body;
    
        if (
          !(
            payload.username &&
            payload.email &&
            payload.role &&
            payload.password
          )
        ) {
          const response: DefaultResponse = {
            status: "BAD_REQUEST",
            message: "fields cannot be empty",
            data: {
              created_user: null,
            },
          };
    
          return res.status(400).send(response);
        }
    
        const createdUser: User | ErrorResponse = await UsersService.createUser(payload);
    
        const response: DefaultResponse = {
          status: "CREATED",
          message: "User succesfully created",
          data: {
            created_user: createdUser,
          },
        };
    
        res.status(201).send(response);
      }

      async updateUserById(req: Request, res: Response) {
        const queryId: number = parseInt(req.params.id);
        const payload: UserRequest = req.body;
    
        // Payload validation
        if (
          !(
            payload.username &&
            payload.email &&
            payload.role &&
            payload.password
          )
        ) {
          const response: DefaultResponse = {
            status: "BAD_REQUEST",
            message: "fiedls cannot be empty",
            data: {
              updated_user: null,
            },
          };
          res.status(400).send(response);
        }
        const updatedUser: User | null = await UsersService.updateUserById(
          queryId,
          payload
        );
    
        const userPayload: UserRequest = {
          username: payload.username,
          email: payload.email,
          password: payload.password,
          role: payload.role,
        };
    
        if (!updatedUser) {
          const Response: DefaultResponse = {
            status: "ERROR",
            message: "User not found",
            data: null,
          };
          return res.status(404).send(Response);
        }
    
        const response: DefaultResponse = {
          status: "UPDATED",
          message: "User successfully updated",
          data: {
            old_user: updatedUser,
            update_user: userPayload,
          },
        };
        res.status(200).send(response);
      }

      async deleteUserById(req: Request, res: Response) {
        const queryId: number = parseInt(req.params.id);
        const deletedUser: User | null = await UsersService.deleteUserById(
          queryId
        );
    
        if (!deletedUser) {
          const Response: DefaultResponse = {
            status: "ERROR",
            message: "User not found",
            data: null,
          };
          return res.status(404).send(Response);
        }
    
        const response: DefaultResponse = {
          status: "DELETED",
          message: "User successfully deleted",
          data: {
            deleted_user: deletedUser,
          },
        };
    
        res.status(200).send(response);
      }
}

export default UsersHandler;