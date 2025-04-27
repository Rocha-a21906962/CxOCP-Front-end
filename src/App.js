import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Auth/Chat";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { AuthProvider, AuthConsumer } from "./context/JWTAuthContext";
import { Flex, Spinner } from "@chakra-ui/react";
import FileUploader from "./components/Auth/FileUploader";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthConsumer>
          {(auth) => !auth.isInitialized ? (
            <Flex 
              height={"100vh"} 
              align={"center"} 
              justifyContent={"center"}>
              <Spinner 
                thickness={"4px"}
                speed={"0.65s"}
                color={"green.200"}
                size={"xl"}
              />
            </Flex>
          ):(<Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/uploader" element={<FileUploader />} />
            <Route path="*" element={<Navigate to={"/"}/>} />
          </Routes>
          )
          }
        </AuthConsumer>
      </Router>
    </AuthProvider>
  );
}

export default App;