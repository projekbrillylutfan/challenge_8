import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.bigIncrements("id").primary();
        table.string("username");
        table.string("email");
        table.string("password");
        table.string("role");
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}

