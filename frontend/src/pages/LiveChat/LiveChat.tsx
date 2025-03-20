import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Center, Flex, Spinner, Text } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import { Button } from '../../components/ui/button';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import useWebSocket from '../../hooks/useWebsocket';
import { IChatConversation, IChatHistory } from '../../common/interfaces';
import { useQuery } from '@tanstack/react-query';
import { getChatHistory } from '../../services/chat';
import { useAuth } from '../../hooks/useAuth';
import ReactQuill from 'react-quill';

const LiveChat = () => {
  const { getUser } = useAuth();

  const currentUser = getUser();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [htmlMessage, setHtmlMessage] = useState('');
  const [conversation, setConversation] = useState<IChatConversation[]>([]);

  const modules = {
    toolbar: {
      container: [['image']],
    },
  };

  const formats = ['image'];

  const { data, isSuccess, refetch, isLoading } = useQuery<IChatHistory>({
    queryKey: ['chatHistory'],
    queryFn: () => getChatHistory(),
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { messages, sendMessage } = useWebSocket(
    `ws://localhost:8222/chat-service?userId=${currentUser.email}`,
    isSuccess ? data?.data.content : undefined,
  );

  const structureChatMessages = useCallback(() => {
    const conversations = messages.map((convo) => ({
      ...convo,
      isCurrentUser: convo.senderEmail === currentUser.email,
    }));

    setConversation(conversations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('currentUser', 'Harsha');
    structureChatMessages();
  }, [structureChatMessages]);

  const handleSendMessage = () => {
    const message = {
      type: 'CHAT',
      data: {
        senderEmail: currentUser.email,
        senderName: currentUser.name,
        content: htmlMessage,
        timestamp: new Date(),
      },
    };

    setHtmlMessage('');
    sendMessage(message);
  };

  const quillRef = useRef<any>(null);

  useEffect(() => {
    const quillEditor = quillRef.current?.getEditor();

    if (quillEditor) {
      quillEditor.on(
        'text-change',
        (delta: any, oldDeltadelta: any, source: any) => {
          if (source === 'user') {
            const editorContainer = quillEditor.root;
            const images = editorContainer.querySelectorAll('img');

            images.forEach((img: HTMLImageElement) => {
              if (!img.style.width || !img.style.height) {
                img.style.width = '75px';
                img.style.height = '50px';
              }
            });
          }
        },
      );
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex
      flexDir="column"
      lgDown={{ py: 5, px: 2 }}
      lg={{ px: 28, py: 12 }}
      xl={{ px: 32, py: 12 }}
      h="full"
    >
      <Text
        textAlign={{ base: 'center', md: 'left' }}
        fontSize="3xl"
        fontWeight="bold"
        mb={5}
      >
        Live Chat
      </Text>
      <Flex
        flexDir="column"
        borderWidth={1}
        borderColor="gray.300"
        borderRadius="lg"
        bg="gray.200"
        flexGrow={1}
        css={scrollBarCss}
        shadow="md"
        overflow="auto"
        ref={chatContainerRef}
      >
        <Box h="full" px={5} py={3}>
          {conversation.length > 0 &&
            conversation.map((convo, index) => (
              <Flex
                key={convo.id}
                justify={convo.isCurrentUser ? 'flex-end' : 'flex-start'}
                my={2}
                paddingBottom={index === conversation.length - 1 ? '1rem' : ''}
              >
                {!convo.isCurrentUser && (
                  <Box hideBelow="md" mt={1} me={1}>
                    <FaUserCircle size={24} />
                  </Box>
                )}
                <Box
                  maxW="70%"
                  bg={convo.isCurrentUser ? 'blue.500' : 'gray.300'}
                  color={convo.isCurrentUser ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  shadow="sm"
                  pos={'relative'}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    {convo.isCurrentUser ? 'You' : convo.senderName}
                  </Text>
                  <Flex flexDir={'row'} alignItems={'flex-end'} gap={3}>
                    <div dangerouslySetInnerHTML={{ __html: convo.content }} />
                    <Text
                      fontSize={{ base: '2xs', md: '2xs' }}
                      textAlign="right"
                      mt={1}
                    >
                      {new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Colombo',
                      })
                        .format(new Date(convo.timestamp))
                        .replace(':', '.')}
                    </Text>
                  </Flex>
                </Box>
                {convo.isCurrentUser && (
                  <Box hideBelow="md" mt={1} ms={1}>
                    <FaUserCircle size={24} />
                  </Box>
                )}
              </Flex>
            ))}
        </Box>
      </Flex>
      <Flex
        bottom={2}
        zIndex={10}
        p={3}
        bg="white"
        borderTopWidth={1}
        borderTopColor="gray.300"
        borderRadius="md"
        shadow="md"
        gap={2}
        alignItems="center"
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          style={{ width: '100%' }}
          value={htmlMessage}
          onChange={setHtmlMessage}
          modules={modules}
          formats={formats}
        />
        <Button onClick={() => handleSendMessage()} colorPalette="primary">
          <Text hideBelow="md">Send</Text>
          <Box hideFrom="md">
            <IoIosSend />
          </Box>
        </Button>
      </Flex>
    </Flex>
  );
};

export default LiveChat;
