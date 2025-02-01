import { FirebaseAuthService } from './firebase-auth';
import { AuthService } from "./types.ts";

export * from './types';
export const authService: AuthService = new FirebaseAuthService();
