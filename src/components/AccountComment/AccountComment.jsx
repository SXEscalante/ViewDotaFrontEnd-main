import "./AccountComment.css"

const AccountComment = ({comment}) => {
    return ( 
        <div className="comment">
            <h2>{comment.user.username}</h2>
            <p>{comment.text}</p>
        </div>
    );
}
 
export default AccountComment;