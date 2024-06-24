const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("nova", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveImageToIndexedDB = (id: string, imageBlob: Blob): void => {
    openDatabase()
        .then((db) => {
            const transaction = db.transaction(["images"], "readwrite");
            const store = transaction.objectStore("images");
            store.put({ id, imageBlob });
        })
        .catch((error) => {
            console.error("IndexedDB error:", error);
        });
};

export const loadImageFromIndexedDB = (id: string): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
        openDatabase()
            .then((db) => {
                const transaction = db.transaction(["images"], "readonly");
                const store = transaction.objectStore("images");
                const request = store.get(id);

                request.onsuccess = function () {
                    resolve(request.result ? request.result.imageBlob : null);
                };

                request.onerror = function () {
                    reject(request.error);
                };
            })
            .catch((error) => {
                console.error("IndexedDB error:", error);
            });
    });
};

export const deleteImageFromIndexedDB = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        openDatabase()
            .then((db) => {
                const transaction = db.transaction(["images"], "readwrite");
                const store = transaction.objectStore("images");
                const request = store.delete(id);

                request.onsuccess = function () {
                    resolve();
                };

                request.onerror = function () {
                    reject(request.error);
                };
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const loadImagesFromIndexedDB = async (keys: string[]) => {
    try {
        const promises = keys.map((key) => loadImageFromIndexedDB(key));
        return await Promise.all(promises);
    } catch (e) {
        console.error("Failed load images from db");
        return [];
    }
};