import { useContext } from "react";
import { AppContext } from "./ContextProvider";

const useAppContext = () => {
    const contextValue = useContext(AppContext)
    return contextValue
};

export default useAppContext;