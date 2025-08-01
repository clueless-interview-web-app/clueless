import PROMPT_MESSAGES from '@/constants/prompt-messages';
import { useAutoScrollToBottom } from '@/hooks/ui/use-auto-scroll-to-bottom';
import { Message, MessageRoleType } from '@/types/message';
import Markdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

export default function ChatMessages({ messages }: { messages: Message[] }) {
  const { scrollAreaRef } = useAutoScrollToBottom(messages);

  const messagesWithoutOutput = messages.map((message) =>
    message.parts[0].text.startsWith(
      PROMPT_MESSAGES.USER_SUBMITTED_CODE_MESSAGE
    )
      ? {
          ...message,
          parts: [
            {
              text: PROMPT_MESSAGES.USER_SUBMITTED_CODE_MESSAGE_WITHOUT_OUTPUT,
            },
          ],
        }
      : message
  );

  return (
    <ScrollArea className="overflow-y-auto h-full" ref={scrollAreaRef}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {messagesWithoutOutput.map((message, idx) => (
            <div
              key={idx}
              data-testid={`chat-message-${message.role}-${idx}`}
              className={`flex gap-3 ${
                message.role === MessageRoleType.MODEL ? '' : 'flex-row-reverse'
              }`}
            >
              <Avatar>
                {message.role === MessageRoleType.MODEL ? (
                  <AvatarImage
                    src="/google-gemini-logo.png"
                    className="bg-gray-300 border-1 border-gray-800 dark:border-gray-200 rounded-2xl p-0.5"
                  />
                ) : (
                  <AvatarImage
                    src="/person.svg"
                    className="bg-gray-300 border-1 border-gray-800 dark:border-gray-200 rounded-2xl p-0.5"
                  />
                )}
                <AvatarFallback>
                  {message.role === MessageRoleType.MODEL ? 'AI' : 'ME'}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg p-4 max-w-120 ${
                  message.role === MessageRoleType.MODEL
                    ? 'bg-blue-300 dark:bg-blue-700'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </ScrollArea>
  );
}
