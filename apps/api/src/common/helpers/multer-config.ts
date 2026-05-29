import { BadRequestException } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { basename, extname } from "path";
import { v4 as uuidv4 } from "uuid";

export const documentFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedExtensions = [".jpeg", ".jpg", ".png", ".pdf", ".doc", ".docx"];
  const fileExtension = extname(file.originalname).toLowerCase();

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        "Invalid file type. Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed.",
      ),
      false,
    );
  }

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(
      new BadRequestException(
        "Invalid file extension. Only .jpeg, .jpg, .png, .pdf, .doc, and .docx are allowed.",
      ),
      false,
    );
  }
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size && file.size > maxSize) {
    return cb(
      new BadRequestException(
        `File size too large. Maximum allowed size is 5MB. Received: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      ),
      false,
    );
  }

  return cb(null, true);
};

export const manualDocumentFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const allowedExtensions = [
    ".jpeg",
    ".jpg",
    ".png",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".zip",
  ];
  const fileExtension = extname(file.originalname).toLowerCase();

  if (
    !allowedMimeTypes.includes(file.mimetype) &&
    !allowedExtensions.includes(fileExtension)
  ) {
    return cb(
      new BadRequestException(
        "Invalid file type. Allowed: Images, PDF, Word, Excel, CSV, ZIP.",
      ),
      false,
    );
  }

  const maxSize = 20 * 1024 * 1024; // 20MB limit
  if (file.size && file.size > maxSize) {
    return cb(
      new BadRequestException(
        `File size too large. Maximum allowed size is 20MB.`,
      ),
      false,
    );
  }

  return cb(null, true);
};

// filter for comment attachments - accepts all file types
export const commentAttachmentFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any,
) => {
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (file.size && file.size > maxSize) {
    return cb(
      new BadRequestException(
        `File size too large. Maximum allowed size is 50MB. Received: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      ),
      false,
    );
  }

  // Allow all file types
  return cb(null, true);
};

export const createStorageConfig = (folderPath: string, filePrefix: string) => {
  return diskStorage({
    destination: (req, file, cb) => {
      const folder = `./uploads/${folderPath}`;
      if (!existsSync(folder)) {
        mkdirSync(folder, { recursive: true });
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = uuidv4();
      const ext = extname(file.originalname);
      const originalNameWithoutExt = basename(file.originalname, ext);

      const cleanOriginalName = originalNameWithoutExt
        .replace(/[^a-zA-Z0-9\-_]/g, "_")
        .substring(0, 50);

      const finalFilename = `${cleanOriginalName}-${filePrefix}-${uniqueSuffix}${ext}`;
      cb(null, finalFilename);
    },
  });
};

export const createMulterConfig = (
  folderPath: string,
  filePrefix: string,
  maxFiles: number = 5,
  maxSize: number = 20 * 1024 * 1024,
  customFileFilter?: any,
) => {
  return {
    storage: createStorageConfig(folderPath, filePrefix),
    fileFilter: customFileFilter || documentFileFilter,
    limits: {
      files: maxFiles,
      fileSize: maxSize,
    },
  };
};

export const ProfilePicInterceptor = FileInterceptor(
  "profilePic",
  createMulterConfig(
    "profile-pics", // folder
    "profile-pic", // prefix
    1, // max files
    5 * 1024 * 1024, // 5MB limit
  ),
);
