import { adminDb } from '../data/admin.js';

const messagesCollection = adminDb.collection('messages');

export async function saveMessage(messageData) {
    const docRef = await messagesCollection.add(messageData);

    return {
        id: docRef.id,
        ...messageData
    };
}

export async function getAllMessages() {
    const querySnapshot = await messagesCollection
        .orderBy('createdAt', 'desc')
        .get();

    const messages = [];

    querySnapshot.forEach((doc) => {
        messages.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return messages;
}

export async function markMessageAsRead(id) {
    const messageRef = messagesCollection.doc(id);

    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
        return false;
    }

    await messageRef.update({
        status: 'leído'
    });

    return true;
}

export async function deleteMessage(id) {
    const messageRef = messagesCollection.doc(id);

    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
        return false;
    }

    await messageRef.delete();

    return true;
}