import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Input,
    useColorModeValue,
    useToast,
  } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//import { useAuth } from "../../hooks/useAuth";
  
export const Login = () => {
    
    const { handleSubmit, register, formState: { errors, isSubmitting }, } = useForm();
    const navigate = useNavigate();
    //const { login } = useAuth();
    const toast = useToast();
    const onSubmit = async (values) => {
      try {
        // Send credentials to the backend to get the JWT token
        const response = await axios.post("http://localhost:5671/api/v1/auth/login", {
          username: values.username,
          password: values.password,
        });

        // Assuming the response contains the JWT token
        const { access_token, refresh_token } = response.data;

        // Log the token to check if it's returned correctly
        console.log("Access Token:", access_token);
        console.log("Refresh Token:", refresh_token);

        // Store the token in local storage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Show success message
        toast({
          title: "Login successful",
          status: "success",
          isClosable: true,
          duration: 1500,
        });

        // Set the token in axios default headers for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

        // Redirect to the chat page
        navigate("/chat", { replace: true });

        } catch (error) {
          toast({
            title: "Invalid username or password",
            status: "error",
            isClosable: true,
            duration: 1500,
          });
        console.error("Login error:", error);
      }
    };
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex
          direction="column"
          alignItems="center"
          background={useColorModeValue("gray.100", "gray.700")}
          p={12}
          rounded={6}
        >
          <Heading mb={6}>Login</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.username}>
              <Input
                placeholder="Username"
                background={useColorModeValue("gray.300", "gray.600")}
                type="text"
                size="lg"
                mt={6}
                {...register("username", {
                  required: "This is a required field",
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <Input
                placeholder="Password"
                background={useColorModeValue("gray.300", "gray.600")}
                type="password"
                size="lg"
                mt={6}
                {...register("password", {
                  required: "This is a required field",
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              isLoading={isSubmitting}
              loadingText="Logging in..."
              width="100%"
              colorScheme="green"
              variant="outline"
              mt={6}
              mb={6}
              type="submit"
            >
              Login
            </Button>
          </form>
          <Button
            onClick={() => navigate("/register", { replace: true })}
            width="100%"
            colorScheme="gray"
            variant="outline"
            mt={6}
          >
            Register Instead
          </Button>
        </Flex>
      </Flex>
    );
};