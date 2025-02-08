import { doc, setDoc } from 'firebase/firestore';
import {getFirestoreDb} from '../../firebase/config';
import {DataService, LakeSystemStatus} from './types';

export class FirestoreService implements DataService {
    private db = getFirestoreDb();  // Use the factory function

    async saveEnabledLakes(lakes: LakeSystemStatus[]): Promise<void> {
        const docRef = doc(this.db, 'system', 'enabled');
        await setDoc(docRef, { lakes });
    }
}
