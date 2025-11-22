import { uuidv7 } from 'uuidv7';

export function generateId() {
    return uuidv7();
}

export function verifyUuid(uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}