import { app } from "../firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";

export const deleteImage = async (url) => {
    const storage = getStorage(app);
    const imageRef = ref(storage, url);
    try {
        await deleteObject(imageRef);
        console.log("Image deleted successfully");
    } catch (error) {
        throw new Error("Image deletion failed: " + error.message);
    }
};
