import { User } from "./auth"

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
export type ApprovalFlowStep = {
  departmentId: number
  approverId: number
  stepOrder: number
}

export interface ApprovalFlow {
  name: string
  steps: ApprovalFlowStep[]
  id: number
  usageType: "single" | "multiple"
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
    department: Department
  }
  createdBy: {
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
  signedUserIds: number[]
  approvedUserIds: number[]
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

export interface ApprovalStep {
  approver: User
  approverId: number
  department: Department
  createdAt: string
  departmentId: number
  id: number
  stepOrder: number
  templateId: number
  updatedAt: string
}

export interface ApprovalFlowsList {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  steps: ApprovalStep[]
  updatedAt: string
}

export const mapiContractStatus = {
  draft: {
    label: "Mới",
    value: "new",
    color: {
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
    },
  },
  pending_approval: {
    label: "Chờ duyệt",
    value: "pending",
    color: {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    },
  },
  rejected: {
    label: "Từ chối",
    value: "rejected",
    color: {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
    },
  },
  ready_to_sign: {
    label: "Đã ký",
    value: "signed",
    color: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
  },
  completed: {
    label: "Hoàn thành",
    value: "completed",
    color: {
      backgroundColor: "#F3E8FF",
      color: "#6B21A8",
    },
  },
  signed_by_me: {
    label: "Đã ký",
    value: "signed_by_me",
    color: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
  },
  waiting_for_sign: {
    label: "Chờ ký",
    value: "waiting_for_sign",
    color: {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    },
  },
  approved_by_me: {
    label: "Đã duyệt",
    value: "approved_by_me",
    color: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
  },
  waiting_for_approval: {
    label: "Chờ duyệt",
    value: "waiting_for_approval",
    color: {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    },
  },
  cancelled: {
    label: "Đã hủy",
    value: "cancelled",
    color: {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
    },
  },
  approved: {
    label: "Đã duyệt",
    value: "approved",
    color: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
  },
  signed: {
    label: "Đã ký",
    value: "signed",
    color: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
  },
}

export const mapiContractStatus2 = {
  draft: {
    label: "Mới",
    value: "new",
    color: {
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
    },
  },
  pending_approval: {
    label: "Chờ duyệt",
    value: "pending",
    color: {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    },
  },
  rejected: {
    label: "Từ chối",
    value: "rejected",
    color: {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
    },
  },
  ready_to_sign: {
    label: "Chờ ký",
    value: "signed",
    color: {
      backgroundColor: "#DCFCE7",
      color: "#166534",
    },
  },
  completed: {
    label: "Hoàn thành",
    value: "completed",
    color: {
      backgroundColor: "#F3E8FF",
      color: "#6B21A8",
    },
  },

  waiting_for_sign: {
    label: "Chờ ký",
    value: "waiting_for_sign",
    color: {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    },
  },
  waiting_for_approval: {
    label: "Chờ duyệt",
    value: "waiting_for_approval",
    color: {
      backgroundColor: "#FEF3C7",
      color: "#92400E",
    },
  },
  cancelled: {
    label: "Đã hủy",
    value: "cancelled",
    color: {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
    },
  },
}

export interface ApprovalTemplate {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Approver {
  id: number
  name: string
  email: string
}

export interface Approval {
  approver: Approver
  status: string
  comments: string
  approvedAt: string
  stepOrder: number
}

export interface Signer {
  signer: {
    id: number
    name: string
    email: string
  }
  status: string
  signOrder: number
  signedAt: string
}

export interface DetailContract {
  id: number
  contractNumber: string
  contractType: string
  createdAt: string
  deletedAt: string | null
  status: string
  note: string
  pdfFilePath: string
  updatedAt: string
  cancelReason: string | null
  customer: User
  createdBy: User
  approvalTemplate: ApprovalTemplate
  approvals: Approval[]
  signers: Signer[]
}

export const mappingRole = {
  admin: "Admin",
  employee: "Nhân viên",
  customer: "Khách hàng",
  manager: "Quản lý",
}

export interface DepartmentList {
  id: number
  departmentName: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ContractStatistics {
  total: number
  details: {
    draft: {
      count: number
      percentage: string
    }
    pending_approval: {
      count: number
      percentage: string
    }
    ready_to_sign: {
      count: number
      percentage: string
    }
    cancelled: {
      count: number
      percentage: string
    }
    completed: {
      count: number
      percentage: string
    }
    rejected: {
      count: number
      percentage: string
    }
  }
}

export interface Notification {
  contract: {
    id: number
    contractNumber: string
    contractType: string
    createdAt: string
    cancelReason: string | null
    deletedAt: string | null
    note: string
    pdfFilePath: string
    status: string
    updatedAt: string
  }
  createdAt: string
  id: number
  isRead: boolean
  message: string
  type: string
}

export interface ContractsInRange {
  cancelReason: string | null
  contractNumber: string
  createdBy: { id: number; name: string }
  id: number
  customer: { id: number; name: string }
  note: string
  status: string
  updatedAt: string
}

export interface CustomerReport {
  customerId: number
  customerName: string
  statistics: {
    total: number
    draft: { count: number; percentage: string }
    pending: { count: number; percentage: string }
    cancelled: { count: number; percentage: string }
    completed: { count: number; percentage: string }
    readyToSign: { count: number; percentage: string }
    rejected: { count: number; percentage: string }
  }
}

export const positionConfigs = [
  {
    label: "Nhân viên",
    value: "employee",
  },
  {
    label: "Quản lý",
    value: "manager",
  },
]

export interface AdvancedStatistics {
  monthlyTrend: { month: string; count: number }[]
  summary: {
    total: number
    byStatus: {
      rejected: number
      cancelled: number
      draft: number
      completed: number
      pending_approval: number
      ready_to_sign: number
    }
  }
  byStatus: {
    cancelled: number
    completed: number
    draft: number
    pending_approval: number
    rejected: number
    ready_to_sign: number
  }

  total: number
  timeRange: null
}
