export interface GoogleUserProps {
    email: string;
    name: string;
    picture: string;
}

export interface BoundsProps {
    northEast: { latitude: number, longitude: number };
    southWest: { latitude: number, longitude: number };
}

export interface TokenPayload {
    userID: number;
    userEmail: string;
}

// export interface PositionProps {
//     latitude: number;
//     longitude: number;
// }

// export interface NewPinProps extends PositionProps {
//     title: string;
//     content: string;
// }