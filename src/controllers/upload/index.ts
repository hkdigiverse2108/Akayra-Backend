import fs from "fs";
import path from "path";
import { HTTP_STATUS, apiResponse } from "../../common";
import { reqInfo, responseMessage } from "../../helper";

export const upload_image = async (req, res) => {
    reqInfo(req);

    try {
        const files = extractUploadedFiles(req);

        if (!files.length) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please upload at least one image file", {}, {}));
        }

        const images = files.map((file) => getFilePayload(req, file));
        const payload = {
            ...images[0],
            images,
            imageUrls: images.map((image) => image.url),
        };

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.fileUploadSuccess, payload, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_images = async (req, res) => {
    reqInfo(req);

    try {
        const folderValue =typeof req.query?.folder === "string"? req.query.folder: typeof req.body?.folder === "string"    ? req.body.folder    : "";
        const folder = folderValue ? sanitizeFolderName(folderValue) : "";

        const targetRoot = folder ? path.resolve(uploadRoot, folder) : uploadRoot;
        if (targetRoot !== uploadRoot && !targetRoot.startsWith(`${uploadRoot}${path.sep}`)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid folder", {}, {}));
        }

        if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("images"), [], {}));
        }

        const images = listAllUploadFiles(targetRoot).map((absolutePath) => {
            const stats = fs.statSync(absolutePath);
            const publicPath = getPublicPath(absolutePath);
            const baseUrl = getUploadBaseUrl();

            return {
                name: path.basename(absolutePath),
                size: stats.size,
                path: publicPath,
                url: baseUrl ? `${baseUrl}/${publicPath}` : `/${publicPath}`,
            };
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("images"), images, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_uploaded_image = async (req, res) => {
    reqInfo(req);

    try {
        const requestedPath = extractUploadPath(findUploadRequestValue(req));

        if (!requestedPath) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please provide image path or URL", {}, {}));
        }

        const absolutePath = resolveUploadFilePath(requestedPath);
        if (!absolutePath || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("file"), {}, {}));
        }

        return res.sendFile(absolutePath);
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_uploaded_image = async (req, res) => {
    reqInfo(req);

    try {
        const requestedPath = extractUploadPath(findUploadRequestValue(req));

        if (!requestedPath) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please provide image path or URL", {}, {}));
        }

        const absolutePath = resolveUploadFilePath(requestedPath);
        if (!absolutePath || !fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("file"), {}, {}));
        }

        fs.unlinkSync(absolutePath);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("image"), { path: requestedPath }, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

const uploadRoot = path.resolve(process.cwd(), "uploads");

type UploadedFile = {
    path: string;
    filename: string;
    mimetype: string;
    size: number;
};

type UploadedFileContainer = UploadedFile[] | Record<string, UploadedFile[]>;

const sanitizeFolderName = (folder?: string) => {
    const normalized = `${folder || ""}`
        .replace(/\\/g, "/")
        .split("/")
        .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ""))
        .filter(Boolean)
        .join("/");

    return normalized || "profile";
};

const getUploadBaseUrl = () => {
    const configuredBaseUrl = `${process.env.Bakend_URL || process.env.BACKEND_URL || ""}`.trim().replace(/\/+$/, "");

    return configuredBaseUrl;
};

const getPublicPath = (absolutePath: string) => {
    const relativePath = path.relative(uploadRoot, absolutePath).replace(/\\/g, "/");
    return `uploads/${relativePath}`;
};

const getFilePayload = (req: any, file: UploadedFile) => {
    const publicPath = getPublicPath(file.path);
    const baseUrl = getUploadBaseUrl();

    return {
        fileName: file.filename,
        mimeType: file.mimetype,
        path: publicPath,
        url: baseUrl ? `${baseUrl}/${publicPath}` : `/${publicPath}`,
    };
};

const extractUploadedFiles = (req: any): UploadedFile[] => {
    const files = (req as { files?: UploadedFileContainer }).files;
    if (!files) return [];
    if (Array.isArray(files)) return files;
    return Object.values(files).flat().filter(Boolean);
};

const listAllUploadFiles = (rootDir: string) => {
    const files: string[] = [];
    const stack: string[] = [rootDir];

    while (stack.length) {
        const current = stack.pop() as string;
        const entries = fs.readdirSync(current, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (entry.isFile()) files.push(entryPath);
        }
    }

    return files;
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

const findUploadRequestValue = (req: any) => {
    const lookup = ["fileUrl", "path", "url", "filePath", "imagePath", "file", "image"];

    for (const key of lookup) {
        const queryValue = typeof req.query?.[key] === "string" ? (req.query[key] as string) : undefined;
        if (queryValue) return queryValue;

        const bodyValue = typeof req.body?.[key] === "string" ? (req.body[key] as string) : undefined;
        if (bodyValue) return bodyValue;
    }

    return "";
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

