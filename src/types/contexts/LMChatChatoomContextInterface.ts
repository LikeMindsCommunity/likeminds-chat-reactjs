import Conversation from "../models/conversations";

export interface LMChatChatroomContextInterface {
  conversationToReply: Conversation | null;
  conversationToedit: Conversation | null;
  setConversationToReply: React.Dispatch<Conversation | null>;
  setConversationToEdit: React.Dispatch<Conversation | null>;
  chatroom: unknown;
}
