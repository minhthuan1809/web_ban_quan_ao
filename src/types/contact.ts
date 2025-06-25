import { AuthUser } from './auth';

// Contact Status Types
export type ContactStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type ContactPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ContactType = 'question' | 'complaint' | 'suggestion' | 'support' | 'other';

// Contact Reply Interface
export interface ContactReply {
  id: number;
  contactId: number;
  userId?: number;
  adminId?: number;
  message: string;
  isFromAdmin: boolean;
  createdAt: number;
  updatedAt: number;
  user?: AuthUser;
  admin?: AuthUser;
}

// Main Contact Interface
export interface Contact {
  id: number;
  userId?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: ContactType;
  status: ContactStatus;
  priority: ContactPriority;
  assignedAdminId?: number;
  lastReplyAt?: number;
  resolvedAt?: number;
  createdAt: number;
  updatedAt: number;
  
  // Relations
  user?: AuthUser;
  assignedAdmin?: AuthUser;
  replies?: ContactReply[];
  
  // Computed fields
  replyCount?: number;
  isUnread?: boolean;
}

// Contact History for tracking changes
export interface ContactHistory {
  id: number;
  contactId: number;
  adminId: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
  createdAt: number;
  admin?: AuthUser;
}

// API Response Interface
export interface ContactResponse {
  data: Contact[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats?: ContactStats;
}

// Contact Statistics
export interface ContactStats {
  totalContacts: number;
  pendingContacts: number;
  inProgressContacts: number;
  resolvedContacts: number;
  averageResponseTime: number; // in hours
  satisfactionRate?: number;
}

// Contact Filter and Search
export interface ContactFilter {
  status?: ContactStatus[];
  type?: ContactType[];
  priority?: ContactPriority[];
  assignedAdminId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  isUnread?: boolean;
  hasReplies?: boolean;
}

export interface ContactSearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: ContactFilter;
}

// Create/Update Contact Types
export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: ContactType;
}

export interface UpdateContactData {
  status?: ContactStatus;
  priority?: ContactPriority;
  assignedAdminId?: number;
  note?: string;
}

export interface CreateContactReplyData {
  contactId: number;
  message: string;
  isFromAdmin: boolean;
}

// Contact Form Validation
export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  type?: string;
}

// Admin-specific Contact interfaces (different structure from main Contact)
export interface AdminContact {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  priority: string;
  assignedTo: number;
  assignedToName: string;
  resolvedAt: string;
  createdAt: string;
  updatedAt: string;
  histories?: AdminContactHistory[];
}

export interface AdminContactReply {
  id: number;
  contactId: number;
  adminId: number;
  adminName: string;
  replyMessage: string;
  isEmailSent: boolean;
  emailSentAt: string;
  createdAt: string;
}

export interface AdminContactHistory {
  id: number;
  contactId: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContactResponse {
  totalPages: number;
  totalElements: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    offset: number;
  };
  numberOfElements: number;
  size: number;
  content: AdminContact[];
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
} 