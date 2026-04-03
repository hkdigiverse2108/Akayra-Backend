"use strict";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { HTTP_STATUS, apiResponse } from "../../common";
import { reqInfo, responseMessage } from "../../helper";

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

const resolveUploadFilePath = (relativePath?: string) => {
    let normalizedPath = `${relativePath || ""}`.trim().replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalizedPath) return null;

    if (normalizedPath.toLowerCase().startsWith("uploads/")) {
        normalizedPath = normalizedPath.slice("uploads/".length);
    }

    const segments = normalizedPath
        .split("/")
        .map((segment) => segment.trim().replace(/[^a-zA-Z0-9._-]/g, ""))
        .filter(Boolean);

    if (!segments.length || segments.some((segment) => segment === "." || segment === "..")) {
        return null;
    }

    const absolutePath = path.resolve(uploadRoot, ...segments);
    if (!absolutePath.startsWith(`${uploadRoot}${path.sep}`)) return null;
    return absolutePath;
};

const extractUploadPath = (value?: string) => {
    if (!value || typeof value !== "string") return "";

    let normalized = value.trim();
    if (!normalized) return "";

    try {
        if (/^https?:\/\//i.test(normalized)) {
            const url = new URL(normalized);
            normalized = url.pathname;
        }
    } catch (_error) {
        // Ignore invalid URL and continue with raw value.
    }

    normalized = normalized.replace(/\\/g, "/").replace(/^\/+/, "");
    return normalized;
};

const findUploadRequestValue = (req: Request) => {
    const lookup = [
        "path",
        "url",
        "filePath",
        "imagePath",
        "file",
        "image",
    ];

    for (const key of lookup) {
        const queryValue = typeof req.query?.[key] === "string" ? req.query?.[key] as string : undefined;
        if (queryValue) return queryValue;

        const bodyValue = typeof req.body?.[key] === "string" ? req.body?.[key] as string : undefined;
        if (bodyValue) return bodyValue;
    }

    return "";
};

export const upload_image = async (req: Request, res: Response) => {
    reqInfo(req);
    try {
        const uploadedFiles = (req as any).files || {};
        const uploadedFile = uploadedFiles?.image?.[0] || uploadedFiles?.file?.[0];

        if (!uploadedFile) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please upload an image file", {}, {}));
        }

        const relativePath = path.relative(uploadRoot, uploadedFile.path).replace(/\\/g, "/");
        const publicPath = `uploads/${relativePath}`;
        const host = req.get("host");
        const urlPrefix = host ? `${req.protocol}://${host}` : "";

        const payload = {
            fileName: uploadedFile.filename,
            mimeType: uploadedFile.mimetype,
            size: uploadedFile.size,
            path: publicPath,
            url: urlPrefix ? `${urlPrefix}/${publicPath}` : `/${publicPath}`,
        };

        return res
            .status(HTTP_STATUS.OK)
            .json(new apiResponse(HTTP_STATUS.OK, responseMessage.fileUploadSuccess, payload, {}));
    } catch (error) {
        console.log(error);
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_uploaded_image = async (req: Request, res: Response) => {
    reqInfo(req);
    try {
        const requestedPath = extractUploadPath(findUploadRequestValue(req));

        if (!requestedPath) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please provide image path or URL", {}, {}));
        }

        const absolutePath = resolveUploadFilePath(requestedPath);
        if (!absolutePath || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
            return res
                .status(HTTP_STATUS.NOT_FOUND)
                .json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("file"), {}, {}));
        }

        return res.sendFile(absolutePath);
    } catch (error) {
        console.log(error);
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_uploaded_image = async (req: Request, res: Response) => {
    reqInfo(req);
    try {
        const requestedPath = extractUploadPath(findUploadRequestValue(req));

        if (!requestedPath) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please provide image path or URL", {}, {}));
        }

        const absolutePath = resolveUploadFilePath(requestedPath);
        if (!absolutePath || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
            return res
                .status(HTTP_STATUS.NOT_FOUND)
                .json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("file"), {}, {}));
        }

        fs.unlinkSync(absolutePath);

        return res
            .status(HTTP_STATUS.OK)
            .json(new apiResponse(HTTP_STATUS.OK, "File deleted successfully", { path: requestedPath }, {}));
    } catch (error) {
        console.log(error);
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
