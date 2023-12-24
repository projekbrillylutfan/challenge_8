import { raw } from 'objection';
import { User, UserEntity } from "../models/entity/user";

class UserRepository {

    static async getUsersByUsername(queryName: string): Promise<User[]> {
        let listUser: User[] = [];
    
        if (queryName) {
          listUser = await UserEntity.query().where(
            raw('lower("username")'),
            "like",
            `%${queryName}%`
          );
        } else {
          listUser = await UserEntity.query();
        }
    
        return listUser;
      }

      static async getUsersById(queryId: number): Promise<User[]> {
        const listUser = await UserEntity.query().where("id", queryId);
        return listUser;
      }

      static async createUser(user: User): Promise<User> {
        const createdUser = await UserEntity.query().insert({
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
        });
    
        return createdUser;
      }

      static async updateUserById(
        queryId: number,
        user: User
      ): Promise<User | null> {
        const updateUser = await UserEntity.query().findById(queryId);
    
        if (updateUser) {
          await UserEntity.query().findById(queryId).patch({
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          });
          return updateUser;
        } else {
          return null;
        }
      }

      static async deleteUserById(queryId: number): Promise<User | null> {
        const deletedUser = await UserEntity.query().findById(queryId);
    
        if (deletedUser) {
          await UserEntity.query().findById(queryId).delete();
          return deletedUser;
        } else {
          return null; // user tidak ditemukan
        }
      }

    static async createUserRegister(user: User): Promise<User> {
        const createdUser = await UserEntity.query().insert({
          username: user.username,
          email: user.email,
          password: user.password,
          role: 'member',
        });
    
        return createdUser;
      }
    static async getUserByEmail(email:string): Promise<User | null> {
        const user =  await UserEntity.query().where(
            raw('lower("email")'),
            '=',
            email
        ).first();

        if (user === undefined) {
            return null
        }

        return user;
    }
}

export default UserRepository;