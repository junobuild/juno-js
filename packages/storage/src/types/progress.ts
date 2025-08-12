export interface OnUploadProgressCallbacks {
  onUploadedFileChunks: (fullPath: string) => void;
}

export interface OnUploadProgress {
  progress?: OnUploadProgressCallbacks;
}
