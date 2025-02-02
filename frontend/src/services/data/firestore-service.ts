import { getFirestore, collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { app } from '../../firebase/config';
import { DataService, Lake, CurrentConditions, SystemError } from './types';

export class FirestoreService implements DataService {
    private db = getFirestore(app);

    async getLake(lakeId: string): Promise<Lake | null> {
        const docRef = doc(this.db, 'lakes', lakeId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as Lake : null;
    }

    async getAllLakes(): Promise<Lake[]> {
        const querySnapshot = await getDocs(collection(this.db, 'lakes'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Lake[];
    }

    async updateLake(lakeId: string, data: Partial<Lake>): Promise<void> {
        const docRef = doc(this.db, 'lakes', lakeId);
        await setDoc(docRef, data, { merge: true });
    }

    async getCurrentConditions(lakeId: string): Promise<CurrentConditions | null> {
        const docRef = doc(this.db, lakeId, 'current_conditions');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as CurrentConditions : null;
    }

    async updateCurrentConditions(lakeId: string, data: CurrentConditions): Promise<void> {
        const docRef = doc(this.db, lakeId, 'current_conditions');
        await setDoc(docRef, data);
    }

    async getRecentErrors(lakeId: string = 'general'): Promise<SystemError[]> {
        const errorsRef = collection(this.db, 'system-errors', 'recent', lakeId);
        const querySnapshot = await getDocs(errorsRef);
        return querySnapshot.docs.map(doc => doc.data()) as SystemError[];
    }

    async addSystemError(error: SystemError): Promise<void> {
        const timestamp = new Date().toISOString();
        const docRef = doc(this.db, 'system-errors', 'recent', error.lakeId || 'general', timestamp);
        await setDoc(docRef, error);
    }
}
