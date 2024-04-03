import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const NewMatchCommentForm = ({setOpenNewCommentForm, matchId}) => {
    const [text, setText] = useState('');
    const [user, token] = useAuth();

    const handleNewComment = async (e) => {
        e.preventDefault()

        const comment = {
            text,
            matchId: matchId
        }

        try{
            const response = await axios.post('https://localhost:5001/api/MatchComments', comment, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 201) {
                setOpenNewCommentForm(false)
            }
        }catch (error){
            console.log("Error getting friends comments", error)
        }
    }

    return ( 
        <div>
            <form className="comment-form" onSubmit={handleNewComment}>
                <input className="comment-input" type="text" value={text || ''} onChange={(e) => setText(e.target.value)}/>
                <div className="form-buttons">
                    <button className="submit-button" type="submit">Submit</button>
                    <button className="exit-form" onClick={() => setOpenNewCommentForm(false)}>x</button>
                </div>
            </form>
        </div>
    );
}
 
export default NewMatchCommentForm;