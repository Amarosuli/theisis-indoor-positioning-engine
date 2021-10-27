import {} from "../firebase/config.js";

// Initialize db and auth
export const db = firebase.database();
export const enginelist = db.ref('engine-list')
export const enginetype = db.ref('engine-type')
export const customerlist = db.ref('customer-list')
export const statuslist = db.ref('status-list')
export const storagetype = db.ref('storage-type')
export const storagelist = db.ref('storage-list')
export const users = db.ref('users')