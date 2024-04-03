import { useContext } from "react";
import FriendsListContext from "../context/FriendsListContext";

const useFriends = () => {
  const { friendsList } = useContext(FriendsListContext);
  return [friendsList];
};

export default useFriends;