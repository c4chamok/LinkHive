import React, { createContext } from 'react';
import AppStates from './AppStates';
import AuthStates from './AuthStates';

export const AppContext = createContext()

const ContextProvider = ({children}) => {
    const { showSearchbar, setShowSearchbar, searchText, setSearchText } = AppStates()
    const { login, register, logout, user, loading, setLoading, updateUserProfile, googleSignIn, setUser, userFromDB, refetchUser } = AuthStates()
    const contextValues = {
        showSearchbar, setShowSearchbar, searchText, setSearchText,
        login, register, logout, user, loading, setLoading, updateUserProfile, googleSignIn, setUser, userFromDB, refetchUser
    }
    return (
       <AppContext.Provider value={contextValues}>
            {children}
       </AppContext.Provider>
    );
};

export default ContextProvider;