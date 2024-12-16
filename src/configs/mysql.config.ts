import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./env.config";
import { User } from "src/entities/User.entity";
import { Pin } from "src/entities/Pin.entity";

export const mysqlConfig: TypeOrmModuleOptions = {
    type: "mysql",
    // timezone: '+09:00', // 대한민국 시간
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    entities: [
        User,
        Pin,
    ],
    // dev only!!
    // dropSchema: true, // 그냥 쓰지마라
    synchronize: true,
    timezone: "Z", // 이게 있으니까 정확한 한국 시간이 나온다
}