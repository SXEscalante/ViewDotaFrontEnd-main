import React from "react";
import { useEffect, useContext } from "react";
import FriendsListContext from "../../context/FriendsListContext";
import useAuth from "../../hooks/useAuth";

import search from "../../images/search.png";
import improve from "../../images/improve.png";
import message from "../../images/message.png";

import "./HomePage.css"

const HomePage = () => {
  const [user] = useAuth();
  const {handleFriendsListContext} = useContext(FriendsListContext)

  useEffect(() => {
    handleFriendsListContext()
  }, []);

  return (
    <div className="home-page">
      <div className="hero"></div>
      <div className="home-body">
        <div className="feature-row">
          <img className="home-image" src={search} alt="A magnifying glass with a bar graph inside" />
          <div className="feature-text">
            <p className="feature-head">Track your stats</p>
            <p>View the combined data from you and your friends recent matches, finding trends that could help you win your next matches.</p>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-text">
            <p className="feature-head">Improve your gameplay</p>
            <p>Learn from past is one of the best ways to improve. Track what you are doing well so you can keep building on those habits.</p>
          </div>
          <img className="home-image sparkle" src={improve} alt="3 Sparkles" />
        </div>
        <div className="feature-row">
          <img className="home-image" src={message} alt="A message window" />
          <div className="feature-text">
            <p className="feature-head">Message your friends</p>
            <p>Your teammates are your most important advantage in any game. Keep in touch with the ones you play with most so you can continue to be victorious!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
