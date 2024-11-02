import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./env.config";
import { User } from "src/entities/user.entity";

export const mysqlConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    entities: [
        User,
        
    ],

    // dev only!!
    dropSchema: true, // *실행할 때 디비 초기화*
    synchronize: true,
}