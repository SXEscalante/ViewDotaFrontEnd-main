import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useFriends from "../../hooks/useFriends";


import MatchRow from "../../components/MatchRow/MatchRow";

import "./MatchHistoryPage.css"

const MatchHistoryPage = ({}) => {
    const [sortingId, setSortingId] = useState(0);
    const [matches, setMatches] = useState([]);
    const [matchObjs, setMatchObjs] = useState([]);
    const [sortedMatchObjs, setSortedMatchObjs] = useState([]);
    const [matchWithPlayerObjs, setMatchWithPlayerObjs] = useState([]);
    const [healingUpArrow, setHealingUpArrow] = useState(false);
    const [damageUpArrow, setDamageUpArrow] = useState(false);
    const [durationUpArrow, setDurationUpArrow] = useState(false);
    const [kdaUpArrow, setKdaUpArrow] = useState(false);
    const [netWorthUpArrow, setNetWorthUpArrow] = useState(false);

    const [user] = useAuth();
    const [friendsList] = useFriends();


    const handleMatchHistory = async () => {
        try {
            const response = await axios.get(`https://localhost:5001/api/SteamAPI/account/${user.steamAccountId}`)
            if(response.status === 200){
                const matchObjsData = await Promise.all(response.data.result.matches.map((match) => handleMatchInfo(match.match_id)))
                setMatchObjs(matchObjsData)
            }
        } catch (error) {
            console.log("Error getting account info", error)
        }
    }

    const handleMatchInfo = async (matchId) => {
        try {
            const response = await axios.get(`https://localhost:5001/api/SteamAPI/match/${matchId}`)
            if(response.status === 200){
                return response.data
            }
        } catch (error) {
            console.log("Error getting account info", error)
        }
    }

    const filterPlayerInfo = (matchInfo) => {
        let playerInfo = {}
        if(matchInfo.result && matchInfo && matchInfo.result.players.length > 0){
            playerInfo = matchInfo.result?.players?.filter((player) => player.account_id == user.steamAccountId)
        }
        

        const matchWithPlayerObj = {
            match: matchInfo,
            player: playerInfo
        }

        return matchWithPlayerObj
    }

    const sortMatches = () => {
        setDamageUpArrow(false)
        setDurationUpArrow(false)
        setHealingUpArrow(false)
        setKdaUpArrow(false)
        setNetWorthUpArrow(false)

        let sortedMatches = []
        switch(sortingId) {
            case 0:
                sortedMatches =([...matchWithPlayerObjs])
                break;
            case 1:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => b.player[0].hero_healing - a.player[0].hero_healing)
                break;
            case 2:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => a.player[0].hero_healing - b.player[0].hero_healing)
                setHealingUpArrow(true)
                break;
            case 3:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => b.player[0].hero_damage - a.player[0].hero_damage)
                break;
            case 4:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => a.player[0].hero_damage - b.player[0].hero_damage)
                setDamageUpArrow(true)
                break;
            case 5:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => ((b.player[0].kills + b.player[0].assists) / b.player[0].deaths) - ((a.player[0].kills + a.player[0].assists) / a.player[0].deaths))
                break;
            case 6:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => ((a.player[0].kills + a.player[0].assists) / a.player[0].deaths) - ((b.player[0].kills + b.player[0].assists) / b.player[0].deaths))
                setKdaUpArrow(true)
                break;
            case 7:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => b.match.result.duration - a.match.result.duration)
                break;
            case 8:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => a.match.result.duration - b.match.result.duration)
                setDurationUpArrow(true)
                break;
            case 9:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => b.player[0].net_worth - a.player[0].net_worth)
                break;
            case 10:
                sortedMatches = [...matchWithPlayerObjs].sort((a, b) => a.player[0].net_worth - b.player[0].net_worth)
                setNetWorthUpArrow(true)
                break;
        
        }
            setSortedMatchObjs(sortedMatches)
    }

    const healingDirection = () => {
        if(sortingId === 1){
            setSortingId(2)
        }
        else{
            setSortingId(1)
        }
    }

    const damageDirection = () => {
        if(sortingId === 3){
            setSortingId(4)
        }
        else{
            setSortingId(3)
        }
    }

    const kdaDirection = () => {
        if(sortingId === 5){
            setSortingId(6)
        }
        else{
            setSortingId(5)
        }
    }

    const durationDirection = () => {
        if(sortingId === 7){
            setSortingId(8)
        }
        else{
            setSortingId(7)
        }
    }

    const netWorthDirection = () => {
        if(sortingId === 9){
            setSortingId(10)
        }
        else{
            setSortingId(9)
        }
    }
    
    useEffect(() => {
        handleMatchHistory()
    }, []);

    useEffect(() => {
        if(matchObjs != null){
            setMatchWithPlayerObjs(matchObjs.map((match) => {
                if(match) {
                    return filterPlayerInfo(match);
                }
            }).filter(Boolean));
        }
    }, [matchObjs]);
    
    useEffect(() => {
        sortMatches()
    }, [sortingId, matchWithPlayerObjs]);
    
    useEffect(() => {
        setMatches(sortedMatchObjs.map((match) => <MatchRow key={match.match.result.match_id} matchObj={match.match} friendsList={friendsList}/>))
    }, [sortedMatchObjs]);

    return ( 
        <div className="match-history">
            <table className="match-table">
                <thead>
                    <tr className="table-head">
                        <th>Result</th>
                        <th>K/D/A</th>
                        <th>KDA<button className={`sort-button ${kdaUpArrow ? "up" : "down"}`} onClick={() => kdaDirection()}></button></th>
                        <th>Damage<button className={`sort-button ${damageUpArrow ? "up" : "down"}`} onClick={() => damageDirection()}></button></th>
                        <th>Healing<button className={`sort-button ${healingUpArrow ? "up" : "down"}`} onClick={() => healingDirection()}></button></th>
                        <th>Net Worth<button className={`sort-button ${netWorthUpArrow ? "up" : "down"}`} onClick={() => netWorthDirection()}></button></th>
                        <th className="duration">Duration<button className={`sort-button ${durationUpArrow ? "up" : "down"}`} onClick={() => durationDirection()}></button></th>
                        <th className="friends">Friends</th>
                    </tr>
                </thead>
                <tbody>{matches}</tbody>
            </table>
        </div>
    );
}
 
export default MatchHistoryPage;