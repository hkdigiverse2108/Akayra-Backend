import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { HTTP_STATUS, apiResponse } from "../common";
import { reqInfo } from "../helper";

const uploadRoot = path.resolve(process.cwd(), "uploads");

const sanitizeFolderName = (folder?: string) => {
    const normalized = `${folder || ""}`
        .replace(/\\/g, "/")
        .split("/")
        .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ""))
        .filter(Boolean)
        .join("/");

    return normalized || "profile";
};

const storage = multer.diskStorage({
    destination: (req: Request, _file, cb) => {
        try {
            const bodyFolder = typeof req.body?.folder === "string" ? req.body.folder : "";
            const queryFolder = typeof req.query?.folder === "string" ? req.query.folder : "";
            const folder = sanitizeFolderName(bodyFolder || queryFolder);
            const destinationDir = path.join(uploadRoot, folder);

            fs.mkdirSync(destinationDir, { recursive: true });
            cb(null, destinationDir);
        } catch (error) {
            cb(error as Error, uploadRoot);
        }
    },
    filename: (_req: Request, file, cb) => {
        const extension = path.extname(file.originalname || "").toLowerCase();
        const safeBaseName =
            path
                .basename(file.originalname || "image", extension)
                .replace(/[^a-zA-Z0-9_-]/g, "")
                .slice(0, 60) || "image";

        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName}${extension}`);
    },
});

const uploadImage = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if ((file.mimetype || "").startsWith("image/")) return cb(null, true);
        return cb(new Error("Only image files are allowed"));
    },
}).fields([
    { name: "image", maxCount: 10 },
    { name: "file", maxCount: 10 },
    { name: "images", maxCount: 10 },
    { name: "files", maxCount: 10 },
]);

export const upload_image_middleware = (req: Request, res: Response, next: NextFunction) => {
    reqInfo(req);

    uploadImage(req, res, (error: any) => {
        if (!error) return next();

        const message = error?.message || "Image upload failed";

        return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json(new apiResponse(HTTP_STATUS.BAD_REQUEST, message, {}, error));
    });
};
