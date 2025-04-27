import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Flex, Heading, Input, Text, VStack, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { RiSendPlaneFill } from "react-icons/ri";
import logo from '../../logo_lusofona.jpg';
import { useNavigate, useLocation } from "react-router-dom";

function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [processes, setProcesses] = useState([]); // Dummy data for processes
  const navigate = useNavigate();
  const location = useLocation();

  // Use this effect to get processData passed from FileUploader
  // Check if state is passed
  useEffect(() => {
    if (location.state?.processData) {
      console.log("Process Data received in Chat:", location.state.processData);
      setProcesses([location.state.processData]);  // Ensure it's a new array each time
    }
  }, [location.state]);

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
    navigate("/uploader");
  };

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <Box
        width="250px"
        backgroundColor="blackAlpha.100"
        p={5}
        boxShadow="md"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between" // This ensures the content and button are spaced properly
      >

        <div>
          <Heading size="lg" mb={6}>
            Processes
          </Heading>

          <VStack spacing={3} align="start" width="100%">
            {processes.map((process, index) => (
              <Text key={index} fontSize="lg" padding="8px" backgroundColor="blackAlpha.200" borderRadius="md">
                {process}
              </Text>
            ))}
          </VStack>
        </div>

        <Button
          mt={5}
          colorScheme="teal"
          onClick={addProcess}
          width="100%"
          variant="solid"
        >
          New Process (+)
        </Button>
      </Box>

      {/* Chat Area */}
      <Box flex="1" p={5} display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" mb={6}>
          <img src={logo} alt="Logo" style={{ maxWidth: "50px", marginRight: "10px" }} />
          <Heading size="lg" ml={20}>CxOCP Chatbot</Heading>
        </Box>

        <Box
          flex="1"
          overflowY="auto"
          p={3}
          borderRadius="md"
          boxShadow="sm"
          mb={4}
          display="flex" // Ensure the parent is a flex container
          flexDirection="column" // Stack child elements (messages)
          maxWidth="90%"
        >
          {chats && chats.length ? (
            chats.map((chat, index) => (
              <Box
                key={index}
                p={3}
                mb={2}
                borderRadius="md"
                backgroundColor={chat.role === "user" ? "blackAlpha.100" : "grey.100"}
                alignSelf={chat.role === "user" ? "flex-end" : "flex-start"}
                maxWidth="100%"
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
          <InputGroup width="90%" mt={4}> {/* Wrap the input inside an InputGroup */}
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message and hit enter"
              size="lg"
              pr="40px" // Add some padding to the right to avoid the icon overlapping text
            />
            <InputRightElement width="3rem" children={
              <IconButton
                icon={<RiSendPlaneFill />}  // Use the paper plane icon from react-icons
                variant="ghost"
                onClick={(e) => chat(e, message)}  // Trigger the same chat function on click
                aria-label="Send message"
              />
            } />
          </InputGroup>
        </form>
      </Box>
    </Flex>
  );
}

export default Chat;
