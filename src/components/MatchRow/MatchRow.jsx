import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import heroes from "../../data/DotaHeroes"

import "./MatchRow.css"

const MatchRow = ({matchObj, friendsList}) => {
    const [matchInfo, setMatchInfo] = useState();
    
    const [result, setResult] = useState(0);
    const [heroId, setHeroId] = useState(0);
    const [kills, setKills] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [assists, setAssists] = useState(0);
    const [kda, setKda] = useState(0);
    const [damage, setDamage] = useState(0);
    const [healing, setHealing] = useState(0);
    const [netWorth, setNetWorth] = useState(0);
    const [duration, setDuration] = useState(0);
    const [friends, setFriends] = useState();
    const [friendsInMatch, setFriendsInMatch] = useState([]);
    const [playedHero, setPlayedHero] = useState({});

    const [user] = useAuth();

    const navigate = useNavigate();

    const filterPlayerInfo = (matchInfo) => {
        updateMatchInfo(matchInfo.result.players.filter((player) => player.account_id == user.steamAccountId))
        let tempFriendsInMatch = [];
        for(var friend of friendsList){
            const friendInMatch = (matchInfo.result.players.filter((player) => player.account_id == friend.accountId))
            if(friendInMatch.length > 0){
                tempFriendsInMatch.push(friend.personaName);
            }
        }
        setFriendsInMatch(tempFriendsInMatch.map((friend, i) => <p key={i} className="match-history-friends">{friend}</p>))
    }

    const updateMatchInfo = (playerDetails) => {
        determineMatchResult(playerDetails)
        setHeroId(playerDetails[0].hero_id)
        setKills(playerDetails[0].kills)
        setDeaths(playerDetails[0].deaths)
        setAssists(playerDetails[0].assists)
        setKda((playerDetails[0].kills + playerDetails[0].assists) / playerDetails[0].deaths)
        setDamage(playerDetails[0].hero_damage)
        setHealing(playerDetails[0].hero_healing)
        setNetWorth(playerDetails[0].net_worth)
        formatDuration(matchInfo.result.duration)
    }

    const formatDuration = (duration) => {
        let fullDuration = duration + 90
        let minutes = Math.trunc(fullDuration / 60)
        let seconds = fullDuration % 60
        let formatedDuration = `${minutes}:${seconds}`
        setDuration(formatedDuration)
    }

    const determineMatchResult = (playerDetails) => {
        if(playerDetails[0].team_number === 0 && matchInfo.result.radiant_win === true){
            setResult(1)
        }
        else if(playerDetails[0].team_number === 1 && matchInfo.result.radiant_win === false) {
            setResult(1)
        }
        else {
            setResult(0)
        }
    }

    useEffect(() => {
        setMatchInfo(matchObj)
    }, []);

    useEffect(() => {
        if(matchInfo != null){
            filterPlayerInfo(matchInfo)
        }
    }, [matchInfo]);

    useEffect(() => {
        const playedHeroObj = heroes.filter((hero) => hero.heroId == heroId)
        setPlayedHero(playedHeroObj[0])
    }, [heroId]);

    return ( 
            <tr className={result ? "row-win" : "row-loss"} onClick={() => navigate(`/match/${matchObj.result.match_id}`)}>
                <td className={`result ${result ? "win" : "loss"}`}>
                    {playedHero &&
                        <img className="hero-row-icon" src={playedHero.img} alt="" />}
                    {result ? "Win" : "Loss"}
                </td>
                <td>{`${kills}/${deaths}/${assists}`}</td>
                <td>{Math.round((kda * 10)) / 10}</td>
                <td>{damage}</td>
                <td>{healing}</td>
                <td>{netWorth}</td>
                <td>{duration}</td>
                <td>{friendsInMatch}</td>
            </tr>
    );
}
 
export default MatchRow;