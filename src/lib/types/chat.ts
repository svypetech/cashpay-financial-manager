export interface Message {
  _id: string;
  isRead: boolean;
  isReplied: boolean;
  sender: string;
  senderType: string;
  orderId: string;
  message: string;
  date: string;
  __v?: number;
  showStatus?: boolean;
  image?: string; // New property to control status display
}

export interface ChatUser {
  name: {
    firstName: string;
    lastName: string;
  };
  userImage: string;
  image?: string;
  email?: string;
}
