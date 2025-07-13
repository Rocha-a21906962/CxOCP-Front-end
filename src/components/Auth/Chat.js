import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Flex, Heading, Input, Text, VStack, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { RiSendPlaneFill, RiDeleteBin6Line } from "react-icons/ri";
import logo from '../../logo_lusofona.jpg';
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        // Adjust the URL to your API (proxy or localhost as needed)
        const response = await axios.get("http://localhost:5671/api/v1/process/", {
          withCredentials: true // if your API uses cookies/auth
        });
        // response.data should be an array of process objects
        setProcesses(response.data);

        // Auto-select the first process if the list is not empty
        if (response.data.length > 0) {
          setSelectedProcessId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch processes:", err);
      }
    };

    fetchProcesses();
  }, []);

  // Delete process by index
  const handleDeleteProcess = async () => {
    if (!selectedProcessId) return;
    try {
      await axios.delete(`http://localhost:5671/api/v1/process/${selectedProcessId}`, {
        withCredentials: true,
      });
      setProcesses(prev => prev.filter(p => p.id !== selectedProcessId));
      // After deletion, auto-select the new first process if any remain
      setTimeout(() => {
        setProcesses(current => {
          if (current.length > 0) {
            setSelectedProcessId(current[0].id);
          } else {
            setSelectedProcessId(null);
          }
          return current;
        });
      }, 0);
      toast({
        title: "Process deleted.",
        description: "The process was successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left"
      });
    } catch (err) {
      console.error("Failed to delete process:", err);
      toast({
        title: "Error deleting process",
        description: "There was a problem deleting the process.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left"
      });
    }
  };

  const chat = async (e, messageToSend) => {
    e.preventDefault();
    if (!selectedProcessId) {
      toast({
        title: "Please select a process first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left"
      });
      return;
    }

    setIsTyping(true);

    let msgs = [...chats, { role: "user", content: messageToSend }];
    setChats(msgs);

    window.scrollTo(0, 1e10);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5671/api/v1/chat/",
        { message: messageToSend, process_id: selectedProcessId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setChats([...msgs, response.data]);
      setIsTyping(false);
      window.scrollTo(0, 1e10);
    } catch (error) {
      console.log(error);
      setIsTyping(false);
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
        alignItems="stretch"
        justifyContent="space-between"
      >
        {/* Sidebar content: heading + process list */}
        <VStack align="start" spacing={3} width="100%">
          <Heading size="lg" mb={2} textAlign="center" width="100%">
            Processes
          </Heading>
          {processes.map((process, index) => (
            <Text
              key={process.id || index}
              fontSize="lg"
              padding="8px"
              backgroundColor={selectedProcessId === process.id ? "yellow.300" : "blackAlpha.200"}
              color={selectedProcessId === process.id ? "black" : "black"}
              borderRadius="md"
              width="100%"
              cursor="pointer"
              onClick={() => setSelectedProcessId(process.id)}
              _hover={{ backgroundColor: selectedProcessId === process.id ? "yellow.400" : "yellow.100" }}
              transition="background-color 0.2s"
            >
              {(process.title || '').replace(/\.csv$/, "")}
            </Text>
          ))}
        </VStack>

        {/* Row with both buttons close together */}
        <Flex mt={5} width="100%" gap={2}>
          <Button
            colorScheme="teal"
            onClick={() => navigate("/uploader")}
            width="100%"
            variant="solid"
          >
            New Process (+)
          </Button>
          <IconButton
            icon={<RiDeleteBin6Line />}
            aria-label="Delete selected process"
            colorScheme="red"
            variant="solid"
            onClick={handleDeleteProcess}
            isDisabled={!selectedProcessId}
            ml={2}
          />
        </Flex>
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
          display="flex"
          flexDirection="column"
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
          <InputGroup width="90%" mt={4}>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message and hit enter"
              size="lg"
              pr="40px"
              isDisabled={!selectedProcessId}
            />
            <InputRightElement width="3rem">
              <IconButton
                icon={<RiSendPlaneFill />}
                variant="ghost"
                onClick={(e) => chat(e, message)}
                aria-label="Send message"
                isDisabled={!message || !selectedProcessId}
              />
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </Flex>
  );
}

export default Chat;