import "./AccountInfoDisplay.css"

const AccountInfoDisplay = ({label, value}) => {
    if(!value){
        value = 0;
    }

    return ( 
        <div className="info-box">
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    );
}
 
export default AccountInfoDisplay;