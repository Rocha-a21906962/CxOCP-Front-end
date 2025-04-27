import { useEffect, useReducer, useRef } from "react";
import axiosInstance from "../services/axios";
import { createContext } from "react";
import { validateToken } from "../utils/jwt";
import { resetSession, setSession } from "../utils/session";


const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

export const AuthContext = createContext({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state, action) => {

        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state) => {
        return {
            ...state,
            isAuthenticated: false,
            user: null,
        };
    },
}

const reducer = (state, action) => {
    if (handlers[action.type]) {
        return handlers[action.type](state, action);
    }

    return state;
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        const initialize = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken && validateToken(accessToken)) {
                    setSession(accessToken);
    
                    const response = await axiosInstance.get("/user/me"); // Api to get user details
                    const {data: user} = response;
                    dispatch({  
                        type: "INITIALIZE",
                        payload: { 
                            isAuthenticated: true,
                            user
                        },
                    });
                } else {
                    dispatch({  
                        type: "INITIALIZE",
                        payload: { 
                            isAuthenticated: false,
                            user: null
                        },
                    });
                }
            } catch (error) {
                console.error(error);
                dispatch({  
                    type: "INITIALIZE",
                    payload: { 
                        isAuthenticated: false,
                        user: null
                    },
                });
            }
        };
        initialize();
        isMounted.current = true;   // Avoid calling 2x
    }, []);
    

    const getAccessToken = async (username, password) => {
        const formData = new FormData();
        formData.append("username", username); //needs to be called username even if it is email
        formData.append("password", password);
        try {
            const response = await axiosInstance.post("/auth/login", formData);
            setSession(response.data.access_token, response.data.refresh_token);
        } catch (error) {
            throw error;
        }
    }

    const login = async (username, password) => {
        try {
            await getAccessToken(username, password);
            const response = await axiosInstance.get("/users/me");
            const {data: user} = response;
            dispatch({  
                type: "LOGIN",
                payload: { 
                    user
                },
            });
        } catch (error) {
            throw Promise.reject(error);
        }
    };

    const logout = async () => {
        resetSession();
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const AuthConsumer = AuthContext.Consumer;

