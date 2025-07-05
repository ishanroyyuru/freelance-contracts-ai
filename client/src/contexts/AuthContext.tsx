import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthCtx = {
    token: string | null;
    setToken: (_token: string | null ) => void;
};

const AuthContext = createContext<AuthCtx>({
    token: null,
    setToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(
        () => localStorage.getItem("token")
    );

    const setToken = (newToken: string | null) => {
        if(newToken){
            localStorage.setItem("token", newToken);
        }
        else{
            localStorage.removeItem("token");
        }
        setTokenState(newToken);
    }

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}