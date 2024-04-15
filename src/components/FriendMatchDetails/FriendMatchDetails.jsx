import "./FriendMatchDetails.css";

import items from "../../data/DotaItems";
import heroes from "../../data/DotaHeroes";
import { useDebugValue, useEffect, useState } from "react";

const FriendMatchDetails = ({details}) => {
    const [playedHero, setPlayedHero] = useState({});
    const [playerItems, setPlayerItems] = useState([]);
    const [itemObjs, setItemObjs] = useState([]);

    console.log('etails', details)
        
    useEffect(() => {
        let item1 = details.friendsMatchDetails.item_0
        let item2 = details.friendsMatchDetails.item_1
        let item3 = details.friendsMatchDetails.item_2
        let item4 = details.friendsMatchDetails.item_3
        let item5 = details.friendsMatchDetails.item_4
        let item6 = details.friendsMatchDetails.item_5
        let backpackItem1 = details.friendsMatchDetails.backpack_0
        let backpackItem2 = details.friendsMatchDetails.backpack_1
        let backpackItem3 = details.friendsMatchDetails.backpack_2
        let neutralItem = details.friendsMatchDetails.item_neurals

        setPlayerItems([item1, item2, item3, item4, item5, item6, backpackItem1, backpackItem2, backpackItem3, neutralItem])
    }, [])

    useEffect(() => {
        let itemObjects = playerItems.map((item, i) => {
            let matchedItem
            if(item == 0){
                if(i >= 6){
                    matchedItem = items.find(i => i.name === 'Empty Backpack Slot')
                    matchedItem.class = 'empty_backpack'
                }
                else{
                    matchedItem = items.find(i => i.name === 'Empty Slot')
                }
            }
            else{
                matchedItem = items.find(i => i.itemId === item)
                if(i >= 6){
                    matchedItem.class = 'backpack'
                }
            }
            return matchedItem
        })
        setItemObjs(itemObjects)
    }, [playerItems]);


    useEffect(() => {
        const playedHeroObj = heroes.filter((hero) => hero.heroId == details.friendsMatchDetails.hero_id)
        setPlayedHero(playedHeroObj[0])    
    }, []);

    return ( 
        <div className="friends-match-details">
            <div className="friends-details">
                <div className="data">
                    <p>KDA: </p>
                    <p>{`${details.friendsMatchDetails.kills}/${details.friendsMatchDetails.deaths}/${details.friendsMatchDetails.assists}`}</p>
                </div>
                <div className="data">
                    <p>Damage: </p>
                    <p>{details.friendsMatchDetails.hero_damage}</p>
                </div>
                <div className="data">
                    <p>Heal: </p>
                    <p>{details.friendsMatchDetails.hero_healing}</p>
                </div>
                <div className="data">
                    <p>Net worth: </p>
                    <p>{details.friendsMatchDetails.net_worth}</p>
                </div>
            </div>
            <div className="friend-hero-sidebar">
                    <p>{details.personaName}</p>
                    {playedHero &&
                        <img src={playedHero.img} alt="" className="friends-hero"/>}
                {itemObjs.length > 1 &&
                <div className="friend-hero-inventory">
                        <div className="active-items">
                            <img className="friend-item-img" src={itemObjs[0].img} alt="" />
                            <img className="friend-item-img" src={itemObjs[1].img} alt="" />
                            <img className="friend-item-img" src={itemObjs[2].img} alt="" />
                            <img className="friend-item-img" src={itemObjs[3].img} alt="" />
                            <img className="friend-item-img" src={itemObjs[4].img} alt="" />
                            <img className="friend-item-img" src={itemObjs[5].img} alt="" />
                        </div>
                        <div className="backpack-items">
                            <div className={`${itemObjs[6].empty ? '' : 'friend-filled'}`}>
                                <img className={`${itemObjs[6].empty ? 'friend-empty-backpack-slot' : 'friend-backpack-item'}`} src={itemObjs[6].img} alt="" />
                            </div>
                            <div className={`${itemObjs[7].empty ? '' : 'friend-filled'}`}>
                                <img className={`${itemObjs[7].empty ? 'friend-empty-backpack-slot' : 'friend-backpack-item'}`} src={itemObjs[7].img} alt="" />
                            </div>
                            <div className={`${itemObjs[8].empty ? '' : 'friend-filled'}`}>
                                <img className={`${itemObjs[8].empty ? 'friend-empty-backpack-slot' : 'friend-backpack-item'}`} src={itemObjs[8].img} alt="" />
                            </div>
                        </div>
                </div>}
            </div>
        </div>
    );
}
 
export default FriendMatchDetails;