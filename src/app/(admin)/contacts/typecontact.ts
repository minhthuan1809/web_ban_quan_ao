export interface ContactReply {
    id: number;
    contactId: number;
    adminId: number;
    adminName: string;
    replyMessage: string;
    isEmailSent: boolean;
    emailSentAt: string;
    createdAt: string;
  }
  
  export interface Contact {
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
    histories?: ContactHistory[];
  }
  
  export interface ContactHistory {
    id: number;
    contactId: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
    note: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ContactResponse {
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
    content: Contact[];
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  }