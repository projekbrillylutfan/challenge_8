import { Model, ModelObject } from "objection";
import knexInstance from "../../../config/postgresql";

export class UserEntity extends Model {
  id?: number;
  username!: string;
  email!: string;
  password?: string;
  role?: string;

  static get tableName() {
    return "users";
  }
}

Model.knex(knexInstance);

export type User = ModelObject<UserEntity>;