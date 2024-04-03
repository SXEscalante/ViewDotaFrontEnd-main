import { useNavigate } from "react-router-dom";

import "./FriendListEntry.css"
import { useEffect, useState } from "react";

const FriendsListEntry = ({friend}) => {
    const [safePersonaName, setSafePersonaName] = useState("");
    const navigate = useNavigate();

    return ( 
        <div className="friend-container" onClick={() => navigate(`/friendsAccount/${friend.accountId}`)}>
            <p>{friend}</p>
            <p>{`Games played together: ${friend.recentGames}`}</p>
        </div>
    );
}
 
export default FriendsListEntry;