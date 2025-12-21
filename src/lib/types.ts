export type Hostel = {
    id: number;
    name: string;
    moveInDate?: string;
    moveOutDate?: string;
    totalRooms: number;
    totalCapacity: number;
    totalApprovedUsers: number;
    isFull: boolean;
    approvedUsers: number[],
    pendingUsers: number[],
    rejectedUsers: number[],
    rooms: [
        {
            id: number;
            name: string;
            maxSize: number;
            price: number;
            currentUsers: number;
            userStatuses: [
                {
                    userId: number;
                    status: string;
                }
            ]
        },
    ]
}

export type Room = {
    id: number;
    name: string;
    maxSize: number;
    price: number;
    currentUsers: number;
    hostelId: number | null;
}

export type NewRoomState = {
    name: string;
    maxSize: string;
    price: string;
    hostelId: number | null;
};
