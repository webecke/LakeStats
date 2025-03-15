import { FirebaseAuthService } from "./firebase-auth.ts";
import { AuthService } from "./types.ts";

export * from "./types.ts";
export const authService: AuthService = new FirebaseAuthService();
