import React, { useState } from 'react';

const AppStates = () => {
    const [showSearchbar, setShowSearchbar] = useState(true)
    const [searchText, setSearchText] = useState('');
    return { showSearchbar, setShowSearchbar, searchText, setSearchText };
};

export default AppStates;