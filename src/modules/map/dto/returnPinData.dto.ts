export class PinWithUserDto {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    isUpdated: boolean;
    updatedAt?: Date;
    userName: string;
}