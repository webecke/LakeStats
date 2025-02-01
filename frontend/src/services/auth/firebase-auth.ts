import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    type User as FirebaseUser
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase/config.ts';
import { AuthService, User } from './types';

export class FirebaseAuthService implements AuthService {
    private auth = getAuth(app);

    private transformFirebaseUser(fbUser: FirebaseUser | null): User | null {
        if (!fbUser) return null;

        return {
            id: fbUser.uid,
            email: fbUser.email,
        };
    }

    async signIn(email: string, password: string): Promise<User> {
        const result = await signInWithEmailAndPassword(this.auth, email, password);
        const user = this.transformFirebaseUser(result.user);
        if (!user) throw new Error('Failed to sign in');
        return user;
    }

    async signOut(): Promise<void> {
        await firebaseSignOut(this.auth);
    }

    getCurrentUser(): User | null {
        return this.transformFirebaseUser(this.auth.currentUser);
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return firebaseOnAuthStateChanged(this.auth, (fbUser) => {
            callback(this.transformFirebaseUser(fbUser));
        });
    }
}
