export interface User {
    id: string;
    email: string | null;
    isAdmin: boolean;
}

export interface AuthService {
    signIn(email: string, password: string): Promise<User>;
    signOut(): Promise<void>;
    getCurrentUser(): User | null;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
