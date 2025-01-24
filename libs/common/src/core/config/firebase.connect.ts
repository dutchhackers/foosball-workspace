// import "./firebase.config";
import { db } from "./firebase.config";

export const connectFirestore = () => {
    return db;
}
