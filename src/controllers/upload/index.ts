import path from "path";
import fs from "fs";
import { apiResponse, HTTP_STATUS } from "../../common";
import { reqInfo, responseMessage } from "../../helper";
import { deleteImageSchema } from "../../validation";

export const upload_image = async (req, res) => {
    reqInfo(req);
    try {
        const files = collectFiles(req);

        if (!files.length) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse( HTTP_STATUS.BAD_REQUEST,responseMessage?.noFileUploaded || "No file uploaded", {},{}));
        }

        const uploadedImages = files.map((file) => {
            const cleanPath = toPublicPath(file.path);
            return getFileUrl(cleanPath);
        });

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED,responseMessage?.fileUploadSuccess,{ images: uploadedImages },{}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR,responseMessage?.internalServerError,{},error));
    }
};

export const get_all_images = async (req, res) => {
    reqInfo(req);
    try {
        const baseDir = uploadDir;

        if (!fs.existsSync(baseDir)) {
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK,responseMessage?.getDataSuccess("images"),[],{}));
        }

        const images = listImagesRecursively(baseDir);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK,responseMessage?.getDataSuccess("images"), images,{}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR,responseMessage?.internalServerError,{},error));
    }
};

export const delete_uploaded_image= async (req, res) => {
    reqInfo(req);    try {
        const { error, value } = deleteImageSchema.validate(req.body || {});
        if (error) {return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST,error?.details[0]?.message,{},{}));}
        const { fileUrl } = value;
        const pathname = normalizeDeletePathFromUrl(fileUrl);
        if (!pathname || !pathname.includes("/uploads/")) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST,responseMessage?.unsupportedFileType || "Unsupported file path",{},{}));
        }
        const filePath = path.join(process.cwd(), pathname.replace(/^\//, ""));
        if (!fs.existsSync(filePath)) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND,responseMessage?.getDataNotFound("image"),{},{}));
        }
        fs.unlinkSync(filePath);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK,responseMessage?.deleteDataSuccess("images"),{},{}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR,responseMessage?.internalServerError,{},error));
    }
};


const uploadDir = path.join(process.cwd(), "uploads");
const getBackendUrl = () => {return `${process.env.Bakend_URL || process.env.BACKEND_URL || ""}`.trim().replace(/\/+$/, "");};
const toPublicPath = (absoluteOrRelativePath: string) => {return `${absoluteOrRelativePath || ""}`.replace(/\\/g, "/").replace(/^\/+/, "");};

const getFileUrl = (relativePath: string) => {
    const baseUrl = getBackendUrl();
    return baseUrl ? `${baseUrl}/${relativePath}` : `/${relativePath}`;
};
const collectFiles = (req) => {
    const files = req?.files;
    return Array.isArray(files) ? files : [];
};
const listImagesRecursively = (dir: string) => {
    const images: { name: string; url: string }[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            images.push(...listImagesRecursively(fullPath));
            continue;
        }

        const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
        images.push({name: entry.name,url: getFileUrl(relativePath),});
    }

    return images;
};

const normalizeDeletePathFromUrl = (fileUrl: string) => {
    try {
        const parsedUrl = new URL(fileUrl);
        return parsedUrl.pathname;
    } catch (_error) {
        return "";
    }
};
