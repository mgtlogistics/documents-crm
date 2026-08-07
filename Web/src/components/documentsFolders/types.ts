export type UserType = "client" | "company"

export interface UploadCatalogItem {
  _id: string
  key: string
  title: string
  description?: string
  maxSizeMB: number
  allowedExtensions: string[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface DocumentItem {
  _id: string
  key: string
  name: string
  downloadEndpoint: string
  userType: UserType
  status: boolean
}

export interface PresetAttachment {
  title: string
  fileUrl: string
  description?: string
}

export interface DocumentFolderPresetItem {
  _id: string
  title: string
  userType: UserType
  uploads: UploadCatalogItem[]
  documents: DocumentItem[]
  attachments: PresetAttachment[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface DocumentFoldersOverview {
  uploads: UploadCatalogItem[]
  documents: DocumentItem[]
  presets: DocumentFolderPresetItem[]
}