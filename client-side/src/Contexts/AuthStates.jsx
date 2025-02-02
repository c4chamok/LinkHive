import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAdditionalUserInfo, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/Firebase.config';
import axios from 'axios';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import useAxiosPublic from '../Hooks/useAxiosPublic';


const AuthStates = () => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updated, setUpdated] = useState("")
    const [isNew, setIsNew] = useState(false)
    const [userFromDB, setUserFromDB] = useState(null)
    const axiosPublic = useAxiosPublic();


    const googleProvider = new GoogleAuthProvider()

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                const additionalInfo = getAdditionalUserInfo(result)
                console.log(result, additionalInfo)
                if (additionalInfo.isNewUser) {
                    setIsNew(true);
                }
            })
    }

    const login = (email, Password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, Password)
    }
    const register = (email, Password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, Password)
            .then((result) => {
                const additionalInfo = getAdditionalUserInfo(result)
                console.log(result, additionalInfo)
                if (additionalInfo.isNewUser) {
                    setIsNew(true)
                }
            })
    }

    let isSigningOut = false; 

    const logout = async () => {
        if (isSigningOut) return; 
        isSigningOut = true; 
        try {
            await signOut(auth); 
        } catch (error) {
            console.error("Error on logout", error);
        } finally {
            setLoading(false); 
            isSigningOut = false; 
        }
    };

    const updateUserProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
            .then(() => {
                setUpdated("Profile Updated")
            })
    }

    const token = localStorage.getItem('access-token')
    const refetchUser = async () => {
        if(user?.email && token){
            const { data } = await axiosPublic('/user',{ headers: { authorization : `Bearer ${token}`} })
            setUserFromDB(data)
        }
    }

    useEffect(()=>{
        refetchUser()
    },[user?.email,token])

    useEffect(() => {
        const authUnmount = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            console.log(currentUser);
            try {
                if (currentUser?.email) {
                    await axiosPublic.post('/jwt', {
                        email: currentUser.email
                    }).then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                        }
                    })
                    if (currentUser?.photoURL) {
                        const token = localStorage.getItem('access-token')
                        const response = await axiosPublic.post('/user', {
                            email: currentUser?.email,
                            name: currentUser?.displayName,
                            photo: currentUser?.photoURL
                        }, { headers: { authorization : `Bearer ${token}` } }) 
                    }
                    setLoading(false);
                } else {
                    localStorage.removeItem('access-token');
                    setLoading(false);
                }
            } finally {
                setLoading(false);

            }

        })
        return () => authUnmount()
    }, [updated])

    return { login, register, logout, user, loading, setLoading, updateUserProfile, googleSignIn, setUser, userFromDB, refetchUser }
};

export default AuthStates;