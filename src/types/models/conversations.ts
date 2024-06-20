import Member from "./member";

export default interface Conversation {
  answer: string;
  attachmentCount: number;
  attachmentsUploaded: boolean;
  chatroomId: number;
  communityId: number;
  createdAt: string;
  createdEpoch: number;
  date: string;
  hasFiles: boolean;
  id: number;
  isEdited: boolean;
  member: Member;
  reactions: unknown[]; // Replace with the appropriate type for reactions
  state: number;
  deletedBy?: number;
  deletedByMember?: Member;
}
