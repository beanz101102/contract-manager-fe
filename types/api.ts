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

export type Gender = "Nam" | "Nữ" | "Khác"

export interface EmployeeFormData {
  code: string // Mã nhân viên, tối đa 20 ký tự, unique
  fullName: string // Họ tên đầy đủ
  gender: Gender // Giới tính enum
  dateOfBirth?: string // Ngày sinh
  placeOfBirth?: string // Nơi sinh
  address?: string // Địa chỉ hiện tại
  idNumber: string // Số CMND/CCCD, unique
  idIssueDate?: string // Ngày cấp CMND/CCCD
  idIssuePlace?: string // Nơi cấp CMND/CCCD
  phoneNumber?: string // Số điện thoại, tối đa 15 ký tự
  email: string // Email, unique
  department: number // Phòng ban (quan hệ với Department)
  position?: string // Chức vụ, tối đa 100 ký tự
  username: string // Tên đăng nhập, unique
  passwordHash: string // Mật khẩu (sẽ được hash)
  role?: "admin" | "employee" | "customer" // Vai trò người dùng
  active?: boolean // Trạng thái kích hoạt
  id?: number
}

export const departmentConfigs = [
  {
    label: "Phòng Hành chính Nhân sự",
    value: 1,
  },
  {
    label: "Phòng Pháp lý",
    value: 2,
  },
]

export interface ContractList {
  id: number
  contractNumber: string
  contractType: string
  createdAt: string
  deletedAt: string | null
  signersCount: number
  status: "new" | "pending" | "signed" | "rejected"
  note: string
  pdfFilePath: string
  customer: {
    id: number
    code: string
    fullName: string
    gender: Gender
    dateOfBirth: string | null
    placeOfBirth: string | null
    address: string | null
    idNumber: string
    idIssueDate: string | null
    idIssuePlace: string | null
    phoneNumber: string | null
    email: string
    position: string | null
    role: "customer" | "employee" | "admin"
    username: string | null
    passwordHash: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    refreshToken: string | null
    active: boolean
  }
  createdBy: {
    id: 1
    code: "11"
    fullName: string
    gender: Gender
    dateOfBirth: string | null
    placeOfBirth: string | null
    address: string | null
    idNumber: string
    idIssueDate: string | null
    idIssuePlace: string | null
    phoneNumber: string | null
    email: string
    position: string | null
    role: "employee" | "admin" | "customer"
    username: string
    passwordHash: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    refreshToken: string | null
    active: boolean
  }
}

export interface SignatureList {
  id: number
  signatureImagePath: string
  createdAt: string
  updatedAt: string
  user: {
    id: 1
    code: string
    fullName: string
    gender: Gender
    dateOfBirth: string | null
    placeOfBirth: string | null
    address: string | null
    idNumber: string
    idIssueDate: string | null
    idIssuePlace: string | null
    phoneNumber: string | null
    email: string
    position: string | null
    role: "employee" | "admin" | "customer"
    username: string
    passwordHash: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    refreshToken: string | null
    active: boolean
    department: Department
  }
}
