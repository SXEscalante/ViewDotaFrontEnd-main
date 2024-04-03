import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useFriends from "../../hooks/useFriends";

import AccountInfoDisplay from "../../components/AccountInfoDisplay/AccountInfoDisplay";
import AccountComment from "../../components/AccountComment/AccountComment";
import NewAccountCommentForm from "../../components/NewAccountCommentForm/NewAccountCommentForm";

import "./FriendsAccountPage.css"

import heroes from "../../data/DotaHeroes"

const FriendsAccountPage = ({}) => {
    const [timePeriod, setTimePeriod] = useState(Math.round(Date.now()/1000));
    const [accountInfo, setAccountInfo] = useState({});
    const [filteredAccountInfo, setFilteredAccountInfo] = useState([]);
    const [selectedTimeFrame, setSelectedTimeFrame] = useState(-1);
    const [commentObjs, setCommentObjs] = useState([]);
    const [comments, setComments] = useState([]);
    const [openNewCommentForm, setOpenNewCommentForm] = useState(false);

    const [username, setUsername] = useState("");
    const [damage, setDamage] = useState(0);
    const [kills, setKills] = useState(0);
    const [towerDamage, setTowerDamage] = useState(0);
    const [denies, setDenies] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [healing, setHealing] = useState(0);
    const [lastHits, setLastHits] = useState(0);
    const [assists, setAssists] = useState(0);
    const [netWorth, setNetWorth] = useState(0);
    const [mostPlayedHeroObj, setMostPlayedHeroObj] = useState({});
    const [mostPlayedHero, setMostPlayedHero] = useState({});

    const [friendsList] = useFriends();

    const { friendId } = useParams();

    const handleAccountInfo = async () => {
        
        try {
            const response = await axios.get(`https://localhost:5001/api/SteamAPI/account/${friendId}`)
            if(response.status === 200){
                setAccountInfo(response.data)
            }
        } catch (error) {
            console.log("Error getting account info", error)
        }
    }

    const handleMatchInfo = async (matchId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`https://localhost:5001/api/SteamAPI/match/${matchId}`)
                if(response.status === 200){
                    const heroId = response.data.result.players.filter((player) => player.account_id == friendId)[0].hero_id
                    updateAccountInfo(response.data.result.players.filter((player) => player.account_id == friendId), heroId)
                    resolve(heroId);
                }
            } catch (error) {
                console.log("Error getting match info", error)
                reject();
            }
        })
    }
    
    const handleComments = async () => {
        try{
            const response = await axios.get(`https://localhost:5001/api/AccountComments/${friendId}`, {
            })
            if(response.status === 200){
                setCommentObjs(response.data)
            }
        } catch (error) {
            console.log("Error getting accounts comments", error)
        }
    }

    const updateAccountInfo = (matchInfo) => {
        setDamage(prevDamage => prevDamage + matchInfo[0].hero_damage)
        setKills(prevKills => prevKills + matchInfo[0].kills)
        setTowerDamage(prevTowerDamage => prevTowerDamage + matchInfo[0].tower_damage)
        setDenies(prevDenies => prevDenies + matchInfo[0].denies)
        setDeaths(prevDeaths => prevDeaths + matchInfo[0].deaths)
        setHealing(prevHealing => prevHealing + matchInfo[0].hero_healing)
        setLastHits(prevLastHits => prevLastHits + matchInfo[0].last_hits)
        setAssists(prevAssists => prevAssists + matchInfo[0].assists)
        setNetWorth(prevNetWorth => prevNetWorth + matchInfo[0].net_worth)
    }

    const filterAccountInfo = (matches) => {
        if(matches != null){
            const result = matches.filter((match) => match.start_time >= timePeriod)
            setFilteredAccountInfo(result)
        }
    }


    const resetAccountInfo = () => {
        setDamage(0)
        setKills(0)
        setTowerDamage(0)
        setDenies(0)
        setDeaths(0)
        setHealing(0)
        setLastHits(0)
        setAssists(0)
        setNetWorth(0)
        setMostPlayedHero(-1)
    }
    
    const findMostPlayedHero = (heroIds) => {
        var matchCount = {};
        let topPlayedHero = heroIds[0], maxCount = 0;
        for (let i = 0; i < heroIds.length; i++ ){
            let hero = heroIds[i]

            if(matchCount[hero] == null){
                matchCount[hero] = 1;
            }
            else {
                matchCount[hero]++;
            }

            if (matchCount[hero] > maxCount){
                topPlayedHero = hero;
                maxCount = matchCount[hero]
            }
        }
        const heroObj = {heroId: topPlayedHero, matchCount: maxCount}
        setMostPlayedHeroObj(heroObj)
    }

    const getFriendsName = () => {
        const friendObj = friendsList.filter((friend) => `${friend.accountId}` == friendId)
        setUsername(friendObj[0].personaName)
    }

    useEffect(() => {
        handleAccountInfo()
        handleComments()
        getFriendsName()
    }, []);
    
    useEffect(() => {
        if(accountInfo != null && accountInfo.result != null && accountInfo.result.matches != null){
            filterAccountInfo(accountInfo.result.matches)
            resetAccountInfo()
        }
    }, [timePeriod]);

    useEffect(() => {
        if(filteredAccountInfo != null){
            const promises = filteredAccountInfo.map(match => handleMatchInfo(match.match_id));
            Promise.all(promises).then((heroIds) => {
                findMostPlayedHero(heroIds);
            }).catch((error) => {
                console.log("Error filtering match info:", error)
            })
        }
    }, [filteredAccountInfo]);

    useEffect(() => {
        const mostPlayedHeroData = heroes.filter((hero) => hero.heroId == mostPlayedHeroObj.heroId)
        setMostPlayedHero(mostPlayedHeroData[0])
    }, [mostPlayedHeroObj]);
    
    useEffect(() => {
        setComments(commentObjs.map((comment, i) => <AccountComment key={i} comment={comment}/>))
    }, [commentObjs]);

    useEffect(() => {
        handleComments()
    }, [openNewCommentForm]);

    return ( 
        <div className="account-page">
            <div className="player-stats">
                <div>
                    <h1 className="account-name" >{username}</h1>
                    <div className="account-info">
                        <div className="account-info-header">
                            <h3 className="header-box">Games: {filteredAccountInfo.length}</h3>
                            <div className="header-box time-selector">
                                <h3>Time Period:</h3>
                                <button className={selectedTimeFrame === 1 ? "pressed" : ""} onClick={() => {
                                    setTimePeriod(Math.round(Date.now()/1000) - 86400);
                                    setSelectedTimeFrame(1)
                                }}>1 Day</button>
                                <button className={selectedTimeFrame === 2 ? "pressed" : ""} onClick={() => {
                                    setTimePeriod(Math.round(Date.now()/1000) - 604800);
                                    setSelectedTimeFrame(2)
                                }}>1 Week</button>
                                <button className={selectedTimeFrame === 3 ? "pressed" : ""} onClick={() => {
                                    setTimePeriod(Math.round(Date.now()/1000) - 2592000)
                                    setSelectedTimeFrame(3)
                                }}>1 Month</button>
                            </div>
                        </div>
                        <div className="account-info-body">
                            <AccountInfoDisplay label={"Total Damage Done"} value={damage}/>
                            <AccountInfoDisplay label={"Total Kills"} value={kills}/>
                            <AccountInfoDisplay label={"Total Tower Damage"} value={towerDamage}/>
                            <AccountInfoDisplay label={"Total Denies"} value={denies}/>
                            <AccountInfoDisplay label={"Total Deaths"} value={deaths}/>
                            <AccountInfoDisplay label={"Total Healing"} value={healing}/>
                            <AccountInfoDisplay label={"Total Last Hits"} value={lastHits}/>
                            <AccountInfoDisplay label={"Total Assists"} value={assists}/> 
                            <AccountInfoDisplay label={"Total Net Worth"} value={netWorth}/>
                        </div>
                    </div>
                </div>
                <div className="friend-hero-box">
                    <h2>Top Hero</h2>
                    {mostPlayedHero &&
                        <div className="top-hero">
                        <img className="top-hero-img" src={mostPlayedHero.img} alt="" />
                        <p className="top-hero-name">{mostPlayedHero.name}</p>
                        <p>Games: {mostPlayedHeroObj.matchCount}</p>
                        </div>
                    }
                </div>
            </div>
            <div className="bottom-padding">
                <div className="account-page-comments">
                    <h2 className="comment-header">Comments</h2>
                    {comments}
                    {!openNewCommentForm &&
                        <button className="new-comment-button" onClick={() => setOpenNewCommentForm(true)}>Post new comment</button>}
                    {openNewCommentForm &&
                        <NewAccountCommentForm setOpenNewCommentForm={setOpenNewCommentForm} steamAccountId={friendId}/>}
                </div>
            </div>
        </div>
    );
}
 
export default FriendsAccountPage;