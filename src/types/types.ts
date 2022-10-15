export type Document = {
  id:            string,
  documentHash:  string,
  documentTitle: string,
  documentBrief: string,
  fileId:        string,
  ownerId:       string,
  ownerFullname: string,
  time:          string,
  reference:     string,
  referenceType: string,
  documentType: DocTemplateType,
  signatures:    Signature[],
}

export type Signature = {
  userFullname: string,
  status:       number,
  message:      string
}

export type DocsResponse = {
  count: number,
  docs: Document[]
}

export type User = {
  id:         string,
  firstname:  string,
  lastname:   string,
  middlename: string,
  email:      string,
  telegram:   string,
  position:   string,
  department: string,
  avatar:     string,
  username:   string,
}

export type Recipient = {
  id:       string,
  fullname: string
}

export type Credentials = {
  username: string,
  password: string
}


export type NotificationType = 'signed' | 'info' | 'rejected';
export type Notifications = {
  id: string,
  type: NotificationType,
  text: string,
  createdAt: string,
  link: string
}
export type NotificationMain = {
  count: number,
  notifications: Notifications[]
}
export type NotificationTost = {
  notifications: Notifications[] | null
}

export type LoginResponse = {
  token: string
}
export type GetMetaDocumentsRequest = {
  type: DocType,
  skip: number,
  limit: number,
  sort: DocSort
}

export type GetNotificationsRequest = {
  skip: number,
  limit: number
}

export type DocType = 'new' | 'signed' | 'declined' | 'created' | 'view'

// export type DocTemplateType = 'default' | 'extractStorage' |  'paidLeave ' | 'partTimeWork' | 'passToGGNTU' | 'deliveryNote'

export type DocTemplateTypeObj = {
  default: string,
  extractStorage: string,
  paidLeave: string,
  partTimeWork: string,
  passToGGNTU: string,
  deliveryNote: string,
}
export type DocTemplateType = keyof DocTemplateTypeObj


export type DocSort = 'newest' | 'oldest'

export type TokenInfo = {
  id:       string,
  username: string,
  exp:      number
}