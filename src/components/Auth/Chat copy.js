import { useState } from "react";
import { Box, Button, Flex, Heading, Input, Text, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import logo from '../../logo_lusofona.jpg';

function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [processes, setProcesses] = useState(["Process 1"]); // Dummy data for processes
  const toast = useToast();

  const chat = async (e, message) => {
    e.preventDefault();

    setIsTyping(true);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    window.scrollTo(0, 1e10);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/chat/",
        { message: message },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      msgs.push(response.data);
      setChats(msgs);
      setIsTyping(false);
      window.scrollTo(0, 1e10);
    } catch (error) {
      console.log(error);
    }
  };

  const addProcess = () => {
    setProcesses([...processes, `Process ${processes.length + 1}`]);
    toast({
      title: "Process Added",
      description: "A new process was added.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <Box
        width="250px"
        backgroundColor="gray.100"
        p={5}
        boxShadow="md"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size="lg" mb={6}>
          Processes
        </Heading>

        <VStack spacing={3} align="start" width="100%">
          {processes.map((process, index) => (
            <Text key={index} fontSize="lg" padding="8px" backgroundColor="gray.200" borderRadius="md">
              {process}
            </Text>
          ))}
        </VStack>

        <Button
          mt={5}
          colorScheme="teal"
          onClick={addProcess}
          width="100%"
          variant="solid"
        >
          Add Process
        </Button>
      </Box>

      {/* Chat Area */}
      <Box flex="1" p={5} display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" mb={6}>
          <img src={logo} alt="Logo" style={{ maxWidth: "50px", marginRight: "10px" }} />
          <Heading size="lg">CxOCP Chatbot</Heading>
        </Box>

        <Box
          flex="1"
          overflowY="auto"
          p={3}
          borderRadius="md"
          backgroundColor="gray.50"
          boxShadow="sm"
          mb={4}
        >
          {chats && chats.length ? (
            chats.map((chat, index) => (
              <Box
                key={index}
                p={3}
                mb={2}
                borderRadius="md"
                backgroundColor={chat.role === "user" ? "green.100" : "blue.100"}
                alignSelf={chat.role === "user" ? "flex-end" : "flex-start"}
                maxWidth="80%"
              >
                <Text fontWeight="bold">{chat.role}</Text>
                <Text>{chat.content}</Text>
              </Box>
            ))
          ) : (
            <Text>No chats yet</Text>
          )}

          {isTyping && <Text>Typing...</Text>}
        </Box>

        {/* Input Section */}
        <form onSubmit={(e) => chat(e, message)}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message and hit enter"
            size="lg"
            mt={4}
          />
        </form>
      </Box>
    </Flex>
  );
}

export default Chat;
