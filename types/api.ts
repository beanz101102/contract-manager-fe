export interface UserDetail {
  id: number
  code: string
  fullName: string
  gender: string
  dateOfBirth: string | null
  placeOfBirth: string | null
  address: string
  idNumber: string
  idIssueDate: string | null
  idIssuePlace: string | null
  phoneNumber: string
  email: string
  department: string
  position: string | null
  role: string
}

export interface Contract {
  id: number
  contractNumber: number
  customer: number
  contractType: string
  signersCount: number
  note: string
}

export interface AddUserPayload extends UserDetail {
  username: string
  passwordHash: string
}

export interface UpdateUserPayload extends UserDetail {}

export interface Department {
  id: number
  departmentName: string
  description: string
}

export interface ContractAttachment {
  id: number
  contractId: number
  fileName: string
  fileUrl: string
}

export interface UserSignature {
  id: number
  userId: number
  signatureUrl: string
  createdAt: string
}

export interface ApprovalFlow {
  id: number
  contract: number
  approver: number
  action: string
  actionSource: "customer" | "internal"
  approvalStatus?: "pending" | "approved" | "rejected"
  comments: string
}

export interface ContractSignature {
  id: number
  contractId: number
  signerId: number
  signatureId: number
  signedAt: string
}
