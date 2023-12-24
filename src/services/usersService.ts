import { UserRequest } from "../models/dto/user";
import { ErrorResponse } from "../models/entity/default";
import { User } from "../models/entity/user";
import UserRepository from "../repositories/userRepo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const SALT_ROUND = 10;


class UsersService {
    static async getUsersByUsername(queryName: string): Promise<User[]> {
        const listUser = await UserRepository.getUsersByUsername(queryName);
    
        return listUser;
      }

      static async getUsersById(queryId: number): Promise<User[]> {
        const listUser = await UserRepository.getUsersById(queryId);
    
        return listUser;
      }

      static async createUser(req: UserRequest): Promise<User | ErrorResponse> {
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
                role: req.role,
              };
              const createdUser = await UserRepository.createUser(userToCreate);
      
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

      static async updateUserById(
        queryId: number,
        req: UserRequest
      ): Promise<User | null> {
        const ecryptedPassword = bcrypt.hashSync(req.password, SALT_ROUND);
        const userToUpdate: User = {
          username: req.username,
          email: req.email,
          password: ecryptedPassword,
          role: req.role,
        };
        const updatedUser = await UserRepository.updateUserById(
          queryId,
          userToUpdate
        );
        return updatedUser;
      }

      static async deleteUserById(queryId: number): Promise<User | null> {
        const deletedUser = await UserRepository.deleteUserById(queryId);
        return deletedUser;
      }
}

export default UsersService;