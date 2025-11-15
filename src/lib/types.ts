export type Hostel = {
    id: number;
    name: string;
}

export type Room = {
    id: number;
    name: string;
    maxSize: number;
    currentUsers: number;
    hostelId: number | null;
}

export type NewRoomState = {
    name: string;
    maxSize: string;
    hostelId: number | null;
};