import multer from "multer";
import path from "path";
import fs from "fs";

export const fileStorage = multer.diskStorage({
    destination: (_req, file, cb) => {
        try {
            const baseDir = path.join(process.cwd(), "uploads");

            if (!fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, { recursive: true });
            }
            cb(null, baseDir);
        } catch (error) {
            cb(error as Error, "");
        }
    },

    filename: (_, file, cb) => {
        try {
            const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-");
            cb(null, `${Date.now()}_${sanitizedOriginalName}`);
        } catch (error) {
            cb(error as Error, "");
        }
    },
});

export const fileFilter = (_req, file, cb) => {
    const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only png, jpg, jpeg, webp images are allowed"));
    }
};

export const upload = multer({
    storage: fileStorage,
    fileFilter,
});
