"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
  onFileRemove?: (index: number) => void
  className?: string
  disabled?: boolean
  label?: string
  helpText?: string
  error?: string
  required?: boolean
}

interface FileWithPreview extends File {
  preview?: string
  status?: "pending" | "uploading" | "success" | "error"
  error?: string
}

export function FileUpload({
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  multiple = false,
  onFilesChange,
  onFileRemove,
  className,
  disabled = false,
  label = "Upload Files",
  helpText,
  error,
  required = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`
    }
    return null
  }

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: FileWithPreview[] = []
    const errors: string[] = []

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file(s) allowed`)
    }

    fileArray.forEach((file) => {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`)
      } else {
        const fileWithPreview: FileWithPreview = file
        fileWithPreview.status = "pending"
        
        // Generate preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            fileWithPreview.preview = e.target?.result as string
            setFiles([...files, ...validFiles])
          }
          reader.readAsDataURL(file)
        }
        
        validFiles.push(fileWithPreview)
      }
    })

    if (errors.length > 0) {
      setDragError(errors.join(", "))
      setTimeout(() => setDragError(""), 5000)
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
    onFileRemove?.(index)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all",
          isDragging
            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
          aria-label={label}
          aria-required={required}
        />

        <div className="text-center">
          <Upload
            className={cn(
              "mx-auto h-12 w-12 mb-4",
              isDragging ? "text-orange-500" : "text-gray-400"
            )}
          />
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragging ? "Drop files here" : "Drag and drop files here"}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-orange-500 hover:text-orange-600 underline"
            >
              browse files
            </button>
          </p>
          <p className="text-xs text-muted-foreground">
            Max {formatFileSize(maxSize)} per file
            {multiple && ` • Up to ${maxFiles} files`}
          </p>
        </div>

        {dragError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{dragError}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center">
                  <File className="h-5 w-5 text-gray-500" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {file.status === "uploading" && (
                <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
              )}

              {file.status === "success" && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}

              {file.status === "error" && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}

              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

