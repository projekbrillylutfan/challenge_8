interface UserRequest {
    username: string;
    email: string;
    password: string;
    role?: string;
}

interface UserResponse {
    id: number;
    username: string;
    email: string;
}

export {UserRequest, UserResponse}