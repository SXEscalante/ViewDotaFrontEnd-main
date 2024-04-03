import React, { createContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

export const FriendsListContext = createContext();

export default FriendsListContext;

export const FriendsListProvider = ({children}) => {
    const [friendsList, setFriendsList] = useState(() => {
        const saved = localStorage.getItem('friendsList');
        return saved ? JSON.parse(saved) : [];
    });
    const [user] = useAuth();

    let bigInt = require('big-integer')
    let steamid64ident = bigInt(76561197960265728)

    const handleFriendsListContext = async () => {
        try {
          const response = await axios.get(`https://localhost:5001/api/SteamAPI/friendsList/${user.steamId}`)
          if(response.status === 200){
              setFriendsList(response.data.map((friend) => steamIdToAccountId(friend)))
          }
        } catch (error) {
            console.log("Error getting account info", error)
        }
    }

    const steamIdToAccountId = (friend) =>{
        let bigAccountId = bigInt(friend.steamid).minus(steamid64ident)
        let accountId = bigAccountId.toJSNumber()
        let personaName = friend.personaname
        return {accountId, personaName}
    } 

    useEffect(() => {
        localStorage.setItem('friendsList', JSON.stringify(friendsList));
    }, [friendsList]);

    return(
        <FriendsListContext.Provider value={{friendsList, setFriendsList, handleFriendsListContext}}>{children}</FriendsListContext.Provider>
    )
}