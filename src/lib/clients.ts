import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import type { Client } from '../types';

export type ClientCreationData = Pick<Client, 'name' | 'code' | 'phone' | 'address' | 'debt'>;

export async function createClient(
  data: ClientCreationData,
  ownerId?: string,
  userId?: string,
): Promise<Client> {
  const clientData = { ...data, ownerId, userId };
  const clientRef = await addDoc(collection(db, 'clients'), clientData);
  return { id: clientRef.id, ...clientData };
}
