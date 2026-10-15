import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent, ReactNode } from "react";
import { cx, useStableId } from "../lib/utils";
import { Button, InputField } from "./Primitives";

export type FileUploadStatus = "queued" | "uploading" | "uploaded" | "error";

export type FileUploadItem = {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  error?: string;
};

export type FileUploadHandler = (
  file: File,
  context: { onProgress: (progress: number) => void },
) => Promise<unknown>;

export type FileInputProps = {
  id?: string;
  name?: string;
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  allowedFileTypes?: string | readonly string[];
  maxFiles?: number;
  maxFileSize?: number;
  defaultFiles?: readonly File[];
  uploadEndpoint?: string;
  upload?: FileUploadHandler;
  uploadFieldName?: string;
  uploadHeaders?: Readonly<Record<string, string>>;
  uploadWithCredentials?: boolean;
  onFilesChange?: (files: readonly File[]) => void;
  onUploadComplete?: (files: readonly File[]) => void;
  onUploadError?: (file: File, error: Error) => void;
};

type QueueUpdater = (items: FileUploadItem[]) => FileUploadItem[];
type UploadStep = 1 | 2;

/**
 * A file queue with drag-and-drop selection, previews, validation, and
 * optional uploads. Pass `upload` for a custom transport or
 * `uploadEndpoint` for the built-in XMLHttpRequest transport with progress.
 */
export function FileInput({
  id,
  name,
  className,
  label = "Files",
  description,
  helperText,
  error,
  invalid = false,
  disabled = false,
  multiple = true,
  allowedFileTypes,
  maxFiles,
  maxFileSize,
  defaultFiles = [],
  uploadEndpoint,
  upload,
  uploadFieldName = "file",
  uploadHeaders,
  uploadWithCredentials = false,
  onFilesChange,
  onUploadComplete,
  onUploadError,
}: FileInputProps) {
  const inputId = useStableId("file-input", id);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(0);
  const [items, setItems] = useState<FileUploadItem[]>(() =>
    defaultFiles.map((file) => createQueueItem(file, nextIdRef)),
  );
  const itemsRef = useRef(items);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<UploadStep>(
    defaultFiles.length > 0 ? 2 : 1,
  );
  const acceptedTypes = normaliseAllowedTypes(allowedFileTypes);
  const accept = acceptedTypes.join(",") || undefined;
  const failedItems = items.filter((item) => item.status === "error");
  const queuedItems = items.filter((item) => item.status === "queued");
  const uploadedItems = items.filter((item) => item.status === "uploaded");
  const canAddMore = !maxFiles || items.length < maxFiles;
  const hasUploadTransport = Boolean(upload || uploadEndpoint);
  const hasFailure = failedItems.length > 0;
  const fieldError = error ?? validationError;
  const isInvalid = invalid || Boolean(fieldError) || hasFailure;
  const showSuccess =
    items.length > 0 && uploadedItems.length === items.length && !uploading;

  const updateItems = (updater: QueueUpdater, notifyFilesChange = false) => {
    const nextItems = updater(itemsRef.current);
    itemsRef.current = nextItems;
    setItems(nextItems);
    if (notifyFilesChange) onFilesChange?.(nextItems.map((item) => item.file));
  };

  const openPicker = () => {
    if (!disabled && !uploading && canAddMore) {
      setCurrentStep(1);
      window.requestAnimationFrame(() => inputRef.current?.click());
    }
  };

  const addFiles = (files: readonly File[]) => {
    const currentItems = itemsRef.current;
    const nextItems = multiple ? [...currentItems] : [];
    const seen = new Set(nextItems.map((item) => fileKey(item.file)));
    const rejected: string[] = [];

    for (const file of multiple ? files : files.slice(0, 1)) {
      const reason = fileRejectionReason(
        file,
        acceptedTypes,
        maxFileSize,
        seen,
        maxFiles,
        nextItems.length,
      );
      if (reason) {
        rejected.push(reason);
        continue;
      }
      nextItems.push(createQueueItem(file, nextIdRef));
      seen.add(fileKey(file));
    }

    const hasNewFiles = nextItems.some(
      (item) => !currentItems.some((currentItem) => currentItem.id === item.id),
    );
    if (nextItems.length !== currentItems.length || !multiple)
      updateItems(() => nextItems, true);
    if (hasNewFiles) setCurrentStep(2);
    setValidationError(formatRejectionMessage(rejected));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled && !uploading && canAddMore)
      addFiles(Array.from(event.dataTransfer.files));
  };

  const handleDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPicker();
  };

  const removeFile = (id: string) => {
    if (uploading) return;
    const nextItems = itemsRef.current.filter((item) => item.id !== id);
    updateItems(() => nextItems, true);
    if (nextItems.length === 0) setCurrentStep(1);
  };

  const uploadFile = (file: File, onProgress: (progress: number) => void) => {
    if (upload) return upload(file, { onProgress });
    if (uploadEndpoint)
      return uploadToEndpoint(uploadEndpoint, file, {
        fieldName: uploadFieldName,
        headers: uploadHeaders,
        withCredentials: uploadWithCredentials,
        onProgress,
      });
    return Promise.reject(
      new Error("No upload handler or endpoint is configured."),
    );
  };

  const startUpload = async (requestedIds?: readonly string[]) => {
    if (disabled || uploading || !hasUploadTransport) return;
    const targetItems = itemsRef.current.filter((item) => {
      const isRequested = !requestedIds || requestedIds.includes(item.id);
      return (
        isRequested && (item.status === "queued" || item.status === "error")
      );
    });
    if (!targetItems.length) return;

    setUploading(true);
    updateItems((currentItems) =>
      currentItems.map((item) =>
        targetItems.some((target) => target.id === item.id)
          ? { ...item, status: "uploading", progress: 0, error: undefined }
          : item,
      ),
    );

    await Promise.all(
      targetItems.map(async (target) => {
        try {
          await uploadFile(target.file, (progress) => {
            updateItems((currentItems) =>
              currentItems.map((item) =>
                item.id === target.id
                  ? { ...item, progress: clampProgress(progress) }
                  : item,
              ),
            );
          });
          updateItems((currentItems) =>
            currentItems.map((item) =>
              item.id === target.id
                ? {
                    ...item,
                    status: "uploaded",
                    progress: 100,
                    error: undefined,
                  }
                : item,
            ),
          );
        } catch (cause) {
          const uploadError = toError(cause, "The file could not be uploaded.");
          updateItems((currentItems) =>
            currentItems.map((item) =>
              item.id === target.id
                ? { ...item, status: "error", error: uploadError.message }
                : item,
            ),
          );
          onUploadError?.(target.file, uploadError);
        }
      }),
    );

    setUploading(false);
    const completedItems = itemsRef.current;
    if (
      completedItems.length > 0 &&
      completedItems.every((item) => item.status === "uploaded")
    )
      onUploadComplete?.(completedItems.map((item) => item.file));
  };

  const retryFile = (id: string) => {
    void startUpload([id]);
  };
  const retryFailed = () => {
    void startUpload(failedItems.map((item) => item.id));
  };
  const dropzoneClassName = cx(
    "pango-file-dropzone",
    dragging && "is-dragging",
    isInvalid && "is-invalid",
    items.length > 0 && !isInvalid && "is-valid",
    (!canAddMore || disabled) && "is-disabled",
    className,
  );

  return (
    <InputField
      className="pango-file-input"
      label={label}
      labelFor={inputId}
      description={description}
      error={fieldError}
      helperText={!fieldError ? helperText : undefined}
    >
      <div className="pango-file-uploader">
        {currentStep === 1 && (
          <div className="pango-file-step-panel">
            <div
              className={dropzoneClassName}
              role="button"
              tabIndex={disabled || !canAddMore ? -1 : 0}
              aria-disabled={disabled || !canAddMore || undefined}
              aria-invalid={isInvalid || undefined}
              onClick={openPicker}
              onKeyDown={handleDropzoneKeyDown}
              onDragEnter={(event) => {
                event.preventDefault();
                if (!disabled && canAddMore) setDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!disabled && canAddMore) setDragging(true);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget === event.target) setDragging(false);
              }}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                id={inputId}
                name={name}
                className="pango-file-input-native"
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled || !canAddMore}
                onChange={handleInputChange}
              />
              <span className="pango-file-dropzone-icon">
                <UploadCloud size={22} aria-hidden="true" />
              </span>
              <span className="pango-file-dropzone-copy">
                <strong>
                  {dragging
                    ? "Drop files here"
                    : items.length
                      ? "Add more files"
                      : "Drop files to upload"}
                </strong>
                <span>
                  or <u>browse from your device</u>
                </span>
              </span>
              {(acceptedTypes.length > 0 || maxFileSize) && (
                <span className="pango-file-dropzone-meta">
                  {acceptedTypes.length > 0 &&
                    `Accepted: ${acceptedTypes.join(", ")}`}
                  {acceptedTypes.length > 0 && maxFileSize ? " · " : ""}
                  {maxFileSize
                    ? `Up to ${formatFileSize(maxFileSize)} each`
                    : ""}
                </span>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="pango-file-step-panel">
            <div className="pango-file-step-heading">
              <span>
                <strong>Upload files</strong>
              </span>
              {!uploading && !showSuccess && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
              )}
            </div>
            <FileList
              items={items}
              uploading={uploading}
              onRemove={removeFile}
              onRetry={retryFile}
            />

            {hasFailure && (
              <div className="pango-file-upload-alert" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <span>
                  <strong>
                    {failedItems.length} file
                    {failedItems.length === 1 ? "" : "s"} failed to upload.
                  </strong>{" "}
                  Check the error and retry.
                </span>
                <Button
                  variant="soft"
                  size="sm"
                  icon={<RefreshCw size={13} aria-hidden="true" />}
                  onClick={retryFailed}
                  disabled={uploading}
                >
                  Retry failed
                </Button>
              </div>
            )}

            {showSuccess && (
              <div className="pango-file-upload-success" role="status">
                <span className="pango-file-result-icon">
                  <CheckCircle2 size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Files uploaded</strong>
                  <small>
                    {uploadedItems.length} file
                    {uploadedItems.length === 1 ? "" : "s"} uploaded
                    successfully.
                  </small>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={13} aria-hidden="true" />}
                  onClick={openPicker}
                  disabled={disabled}
                >
                  Upload files
                </Button>
              </div>
            )}

            {queuedItems.length > 0 && (
              <div className="pango-file-upload-actions">
                <span>
                  {hasUploadTransport
                    ? `${queuedItems.length} file${queuedItems.length === 1 ? "" : "s"} ready to upload.`
                    : "Add an upload handler or endpoint to upload these files."}
                </span>
                {hasUploadTransport && (
                  <Button
                    icon={<UploadCloud size={14} aria-hidden="true" />}
                    onClick={() => {
                      void startUpload();
                    }}
                    loading={uploading}
                    disabled={disabled || uploading}
                  >
                    Upload files
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </InputField>
  );
}

function FileList({
  items,
  uploading,
  onRemove,
  onRetry,
}: {
  items: readonly FileUploadItem[];
  uploading: boolean;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  return (
    <div className="pango-file-list">
      {items.map((item) => (
        <FilePreview
          key={item.id}
          item={item}
          uploading={uploading}
          onRemove={() => onRemove(item.id)}
          onRetry={() => onRetry(item.id)}
        />
      ))}
    </div>
  );
}

function FilePreview({
  item,
  uploading,
  onRemove,
  onRetry,
}: {
  item: FileUploadItem;
  uploading: boolean;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const FileIcon = item.file.type.startsWith("image/") ? FileImage : FileText;
  const [previewUrl, setPreviewUrl] = useState<string>();
  const statusLabel =
    item.status === "uploading"
      ? `Uploading ${item.progress}%`
      : item.status === "uploaded"
        ? "Uploaded"
        : item.status === "error"
          ? (item.error ?? "Upload failed")
          : "Ready to upload";
  useEffect(() => {
    if (!item.file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(item.file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.file]);
  return (
    <div
      className={cx(
        "pango-file-preview-item",
        item.status === "error" && "is-error",
        item.status === "uploaded" && "is-uploaded",
      )}
    >
      <span className="pango-file-preview-icon">
        {previewUrl ? (
          <img src={previewUrl} alt="" />
        ) : (
          <FileIcon size={17} aria-hidden="true" />
        )}
      </span>
      <span className="pango-file-preview-copy">
        <strong title={item.file.name}>{item.file.name}</strong>
        <small>
          {formatFileSize(item.file.size)} · {statusLabel}
        </small>
        {item.status === "uploading" && (
          <span
            className="pango-file-progress"
            role="progressbar"
            aria-label={`Uploading ${item.file.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={item.progress}
          >
            <span style={{ width: `${item.progress}%` }} />
          </span>
        )}
      </span>
      <span className="pango-file-preview-action">
        {item.status === "error" && (
          <button
            className="icon-button icon-button-sm icon-button-soft"
            type="button"
            aria-label={`Retry ${item.file.name}`}
            disabled={uploading}
            onClick={onRetry}
          >
            <RefreshCw size={13} aria-hidden="true" />
          </button>
        )}
        {item.status === "uploaded" ? (
          <CheckCircle2
            className="pango-file-status-icon is-success"
            size={17}
            aria-label="Uploaded"
          />
        ) : item.status === "error" ? (
          <AlertCircle
            className="pango-file-status-icon is-error"
            size={17}
            aria-label="Upload failed"
          />
        ) : item.status === "uploading" ? (
          <LoaderCircle
            className="pango-file-status-icon is-loading spin"
            size={17}
            aria-label="Uploading"
          />
        ) : (
          <button
            className="icon-button icon-button-sm"
            type="button"
            aria-label={`Remove ${item.file.name}`}
            disabled={uploading}
            onClick={onRemove}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </span>
    </div>
  );
}

function createQueueItem(
  file: File,
  nextIdRef: { current: number },
): FileUploadItem {
  nextIdRef.current += 1;
  return {
    id: `${file.name}-${file.lastModified}-${nextIdRef.current}`,
    file,
    status: "queued",
    progress: 0,
  };
}

function normaliseAllowedTypes(allowedFileTypes?: string | readonly string[]) {
  if (!allowedFileTypes) return [];
  const values =
    typeof allowedFileTypes === "string"
      ? allowedFileTypes.split(",")
      : allowedFileTypes;
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function fileRejectionReason(
  file: File,
  allowedTypes: readonly string[],
  maxFileSize: number | undefined,
  seen: Set<string>,
  maxFiles: number | undefined,
  currentCount: number,
) {
  if (maxFiles !== undefined && currentCount >= maxFiles)
    return `You can select up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`;
  if (seen.has(fileKey(file))) return `${file.name} has already been added.`;
  if (allowedTypes.length > 0 && !matchesAllowedType(file, allowedTypes))
    return `${file.name} is not an allowed file type.`;
  if (maxFileSize !== undefined && file.size > maxFileSize)
    return `${file.name} is larger than ${formatFileSize(maxFileSize)}.`;
  return undefined;
}

function matchesAllowedType(file: File, allowedTypes: readonly string[]) {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return allowedTypes.some(
    (allowedType) =>
      allowedType === "*/*" ||
      (allowedType.endsWith("/*") &&
        fileType.startsWith(`${allowedType.slice(0, -1)}`)) ||
      (allowedType.startsWith(".") && fileName.endsWith(allowedType)) ||
      allowedType === fileType,
  );
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function formatRejectionMessage(rejected: readonly string[]) {
  if (!rejected.length) return undefined;
  if (rejected.length === 1) return rejected[0];
  return `${rejected[0]} ${rejected.length - 1} other file${rejected.length === 2 ? "" : "s"} were not added.`;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, Math.round(progress)));
}

function toError(cause: unknown, fallback: string) {
  return cause instanceof Error ? cause : new Error(fallback);
}

function uploadToEndpoint(
  endpoint: string,
  file: File,
  {
    fieldName,
    headers,
    withCredentials,
    onProgress,
  }: {
    fieldName: string;
    headers?: Readonly<Record<string, string>>;
    withCredentials: boolean;
    onProgress: (progress: number) => void;
  },
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", endpoint);
    request.withCredentials = withCredentials;
    Object.entries(headers ?? {}).forEach(([key, value]) =>
      request.setRequestHeader(key, value),
    );
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable)
        onProgress((event.loaded / event.total) * 100);
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${request.status}.`));
    });
    request.addEventListener("error", () =>
      reject(new Error("The upload endpoint could not be reached.")),
    );
    request.addEventListener("abort", () =>
      reject(new Error("The upload was cancelled.")),
    );
    const body = new FormData();
    body.append(fieldName, file, file.name);
    request.send(body);
  });
}
