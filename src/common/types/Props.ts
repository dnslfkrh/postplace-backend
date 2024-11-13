export interface GoogleUserProps {
    email: string;
    name: string;
    picture: string;
};

export interface BoundsProps {
    northEast: { latitude: number, longitude: number },
    southWest: { latitude: number, longitude: number }
}