interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export {LoginRequest, RegisterRequest}