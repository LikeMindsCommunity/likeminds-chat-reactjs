export interface LMChatViewProps {
  MessageComponent?: React.FC;
  HeaderComponent?: React.FC;
  InputComponent?: React.FC;
  LoaderComponent?: React.FC;
  headerProps?: unknown;
  inputProps?: unknown;
  channelListProps?: unknown;
}
