"use client";
import { Screen } from "@/constants/constant";
import React, { useContext, createContext, useState } from "react";

// import {  } from "@/constants";

type ScreenContextType = {
    screenStatus: Screen;
    setScreenStatus: (screen: Screen) => void;
}

const ScreenContext = createContext<ScreenContextType>({
    screenStatus: Screen.Login,
    setScreenStatus: () => {}
});

export const ScreenContextProvider : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [screenStatus, setScreenStatus] = useState<Screen>(Screen.Login);

    const handleSetScreenStatus = (screen: Screen) => {
        setScreenStatus(screen);
    };
    const userData = typeof window !== "undefined" && localStorage.getItem("user");
    if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.id) {
            setScreenStatus(Screen.Dashboard);
        }
    }
    return (
        <ScreenContext.Provider value={{ screenStatus, setScreenStatus: handleSetScreenStatus }}>
            {children}
        </ScreenContext.Provider>
    );
};
export const useScreenContext = () => {
    return useContext(ScreenContext);
};