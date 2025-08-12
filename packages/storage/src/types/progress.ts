export interface OnUploadProgressCallbacks {
  onUploadedFileChunks: (fullPath: string) => void;
  onInitiatedBatch: () => void;
  onCommittedBatch: () => void;
}

export interface OnUploadProgress {
  progress?: OnUploadProgressCallbacks;
}
