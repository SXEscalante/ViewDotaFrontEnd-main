import { useNavigate } from "react-router-dom";

import "./FriendListEntry.css"

const FriendsListEntry = ({friend}) => {
    const navigate = useNavigate();

    return ( 
        <div className="friend-container" onClick={() => navigate(`/friendsAccount/${friend.accountId}`)}>
            <p>{friend.personaName}</p>
            <p>{`Games played together: ${friend.recentGames}`}</p>
        </div>
    );
}
 
export default FriendsListEntry;