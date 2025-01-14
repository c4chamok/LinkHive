import React, { createContext } from 'react';
import AppStates from './AppStates';
import AuthStates from './AuthStates';

export const AppContext = createContext()

const ContextProvider = ({children}) => {
    const { showSearchbar, setShowSearchbar, searchText, setSearchText } = AppStates()
    const { login, register, logout, user, loading, updateUserProfile, googleSignIn} = AuthStates()
    const contextValues = {
        showSearchbar, setShowSearchbar, searchText, setSearchText,
        login, register, logout, user, loading, updateUserProfile, googleSignIn,
    }
    return (
       <AppContext.Provider value={contextValues}>
            {children}
       </AppContext.Provider>
    );
};

export default ContextProvider;