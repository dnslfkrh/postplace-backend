export class PinWithUserDto {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    userName: string;
}