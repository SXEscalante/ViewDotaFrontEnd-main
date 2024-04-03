import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import heroes from "../../data/DotaHeroes";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useFriends from "../../hooks/useFriends";

import FriendMatchDetails from "../../components/FriendMatchDetails/FriendMatchDetails";
import AccountComment from "../../components/AccountComment/AccountComment";
import NewMatchCommentForm from "../../components/NewMatchCommentForm/NewMatchCommentForm";

import "./MatchDetailsPage.css"

const MatchDetailsPage = ({}) => {
    const [matchInfo, setMatchInfo] = useState();
    const [result, setResult] = useState(0);
    const [heroId, setHeroId] = useState(0);
    const [items, setItems] = useState([]);
    const [kills, setKills] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [assists, setAssists] = useState(0);
    const [damage, setDamage] = useState(0);
    const [healing, setHealing] = useState(0);
    const [netWorth, setNetWorth] = useState(0);
    const [playerItems, setPlayerItems] = useState([]);
    const [duration, setDuration] = useState(0);
    const [friendsInMatch, setFriendsInMatch] = useState([]);
    const [playedHero, setPlayedHero] = useState({});
    const [commentObjs, setCommentObjs] = useState([]);
    const [comments, setComments] = useState([]);
    const [openNewCommentForm, setOpenNewCommentForm] = useState(false);
    
    const { matchId } = useParams();
    
    const [user] = useAuth();
    const [friendsList] = useFriends();

    const handleMatchInfo = async () => {
        try {
            const response = await axios.get(`https://localhost:5001/api/SteamAPI/match/${matchId}`)
            if(response.status === 200){
                setMatchInfo(response.data.result)
            }
        } catch (error) {
            console.log("Error getting account info", error)
        }
    }

    const handleComments = async () => {
            try{
                const response = await axios.get(`https://localhost:5001/api/MatchComments/${matchId}`)
                if(response.status === 200){
                    setCommentObjs(response.data)
                }
        } catch(error){
            console.log("Error getting match comments", error)
        }
    }

    const filterPlayerInfo = () => {
        updatePlayerInfo(matchInfo.players.filter((player) => player.account_id == user.steamAccountId))
        let tempFriendsInMatch = [];
        for(var friend of friendsList){
            const friendInMatch = (matchInfo.players.filter((player) => player.account_id == friend.accountId))
            if(friendInMatch.length > 0){
                let friendDetails = {
                    friendsMatchDetails: friendInMatch[0],
                    personaName: friend.personaName
                }
                tempFriendsInMatch.push(friendDetails);
            }
        }
        setFriendsInMatch(tempFriendsInMatch.map((friendDetails, i) => <FriendMatchDetails key={i} details={friendDetails}/>))
    }

    const updatePlayerInfo = (playerDetails) => {
        // determineMatchResult(playerDetails)
        console.log(playerDetails)
        setHeroId(playerDetails[0].hero_id)
        setKills(playerDetails[0].kills)
        setDeaths(playerDetails[0].deaths)
        setAssists(playerDetails[0].assists)
        setDamage(playerDetails[0].hero_damage)
        setHealing(playerDetails[0].hero_healing)
        setNetWorth(playerDetails[0].net_worth)
        let playerItems = [playerDetails[0].item_0, playerDetails[0].item_1, playerDetails[0].item_2, playerDetails[0].item_3, playerDetails[0].item_4, playerDetails[0].item_5, playerDetails[0].backpack_0, playerDetails[0].backpack_1, playerDetails[0].backpack_2, playerDetails[0].item_neutral]
        setPlayerItems(playerItems)
        formatDuration(matchInfo.duration)
        determineMatchResult(playerDetails)
    }

    const determineMatchResult = (playerDetails) => {
        if(playerDetails[0].team_number === 0 && matchInfo.radiant_win === true){
            setResult(1)
        }
        else if(playerDetails[0].team_number === 1 && matchInfo.radiant_win === false) {
            setResult(1)
        }
        else {
            setResult(0)
        }
    }

    const formatDuration = (duration) => {
        let fullDuration = duration + 90
        let minutes = Math.trunc(fullDuration / 60)
        let seconds = fullDuration % 60
        let formatedDuration = `${minutes}:${seconds}`
        if(seconds <= 9){
            formatedDuration = `${minutes}:0${seconds}`
        }
        setDuration(formatedDuration)
    }

    useEffect(() => {
        handleMatchInfo()
        handleComments()
    }, []);

    useEffect(() => {
        if(matchInfo != null){
            filterPlayerInfo()
        }
    }, [matchInfo]);

    useEffect(() => {
        const playedHeroObj = heroes.filter((hero) => hero.heroId == heroId)
        setPlayedHero(playedHeroObj[0])
    }, [heroId]);

    useEffect(() => {
        let filteredCommentObjs = [];
        const userComments = commentObjs.filter((comment) => comment.user.steamAccountId == user.steamAccountId)
        let friendsComments = []
        for(let friend of friendsList){
            let tempFriendsComments = commentObjs.filter((comment) => comment.user.steamAccountId === `${friend.accountId}`)
            if (tempFriendsComments.length > 0){
                friendsComments = [...friendsComments, ...tempFriendsComments]
            }
        }
        filteredCommentObjs = [...friendsComments, ...userComments]
        setComments(filteredCommentObjs.map((comment, i) => <AccountComment key={i} comment={comment}/>))
    }, [commentObjs]);

    useEffect(() => {
        handleComments()
    }, [openNewCommentForm]);

    return ( 
        <div className="match-page">
            <div className="match-data">
                <div className="data-container">
                    <div className="data duration">
                        <p>Duration: </p>
                        <p>{duration}</p>
                    </div>
                    
                    <h1 className={`match-result ${result ? "match-win" : "match-loss"}`}>{result ? "Victory" : "Defeat"}</h1>

                    <div className="data">
                        <p>Damage: </p>
                        <p>{damage}</p>
                    </div>
                    <div className="data">
                        <p>Heal: </p>
                        <p>{healing}</p>
                    </div>
                    <div className="data">
                        <p>Net worth: </p>
                        <p>{netWorth}</p>
                    </div>
                    <br />
                    {friendsInMatch}
                </div>
                <div className="match-sidebar">
                    <div className="hero-info">
                        {playedHero &&
                            <img src={playedHero.img} alt="" className="hero-image"/>}
                        <p>Kills: {kills}</p>
                        <p>Deaths: {deaths}</p>
                        <p>Assists: {assists}</p>
                    </div>
                    <div className="items">
                        <p>{playerItems[0]}</p>
                        <p>{playerItems[1]}</p>
                        <p>{playerItems[2]}</p>
                        <p>{playerItems[3]}</p>
                        <p>{playerItems[4]}</p>
                        <p>{playerItems[5]}</p>
                        <p>{playerItems[6]}</p>
                        <p>{playerItems[7]}</p>
                        <p>{playerItems[8]}</p>
                        <p>{playerItems[9]}</p>
                    </div>
                </div>
            </div>
            <div className="bottom-padding">
                <div className="match-comments">
                    <h2 className="comment-header">Comments</h2>
                    {comments}
                    {!openNewCommentForm &&
                        <button className="new-comment-button" onClick={() => setOpenNewCommentForm(true)}>Post new comment</button>}
                    {openNewCommentForm &&
                        <NewMatchCommentForm setOpenNewCommentForm={setOpenNewCommentForm} matchId={matchId}/>}
                </div>
            </div>
        </div>
    );
}
 
export default MatchDetailsPage;