import { Button, Flex, FormControl, FormErrorMessage, Heading, Input, useColorModeValue, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (values) => {
    
    console.log("Form submitted with values:", values);  // Add this line to check if it's triggered
    
    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/create", {
        email: values.email,
        username: values.username,
        password: values.password,
        });

        console.log("Response from backend:", response);  // Log the response to check if it works

        // Show success message
        toast({
          title: "Registration successful",
          status: "success",
          isClosable: true,
          duration: 1500,
          });

        // Redirect to the login page
        navigate("/login", { replace: true });

      // Proceed with further steps like navigation or feedback
      } catch (error) {
        
        console.error("Error in registration:", error);  // Log errors for debugging
        
        // Handle error response from the backend
        toast({
        title: "Registration failed",
        description: error.response?.data?.detail || "Something went wrong!",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
      }
    };

  return (
    <Flex height={"100vh"} align={"center"} justifyContent={"center"}>
      <Flex direction={"column"} alignItems={"center"} background={useColorModeValue("gray.100", "gray.700")} p={12} rounded={6}>
        <Heading mb={6}>Register</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <Input
              placeholder={"Email"}
              background={useColorModeValue("gray.300", "gray.600")}
              type={"email"}
              size={"lg"}
              mt={6}
              {...register("email", { required: "This is a required field" })}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.username}>
            <Input
              placeholder={"Username"}
              background={useColorModeValue("gray.300", "gray.600")}
              type={"text"}
              variant={"filled"}
              size={"lg"}
              mt={6}
              {...register("username", {
                required: "This is a required field",
                minLength: {
                  value: 4,
                  message: "Minimum length should be at least 4 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Maximum length should be at most 20 characters",
                },
              })}
            />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <Input
              placeholder={"Password"}
              background={useColorModeValue("gray.300", "gray.600")}
              type={"password"}
              size={"lg"}
              mt={6}
              {...register("password", {
                required: "This is a required field",
                minLength: {
                  value: 4,
                  message: "Minimum length should be at least 4 chars long",
                },
                maxLength: {
                  value: 24,
                  message: "Maximum length should be at most 24 chars long",
                },
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>

          <Button
            isLoading={isSubmitting}
            loadingText={"Registering..."}
            width={"100%"}
            colorScheme="green"
            variant={"outline"}
            mt={6}
            type="submit"
          >
            Register
          </Button>

          <Button
            onClick={() => navigate("/login", { replace: true })}
            width={"100%"}
            colorScheme="gray"
            variant={"outline"}
            mt={6}
          >
            Login Instead
          </Button>

        </form>
      </Flex>
    </Flex>
  );
};
