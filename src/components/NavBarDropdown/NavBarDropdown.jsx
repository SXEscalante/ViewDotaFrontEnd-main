import "./NavBarDropdown.css"

const NavBarDropdown = ({username, logoutUser}) => {
    return ( 
        <div className="dropdown">
            <button className="dropdown-button">{`Welcome ${username.userName}`}</button>
            <div className="dropdown-content">
                <a className='dropdown-option' href="/account">Account</a>
                <a className='dropdown-option' href="/matches">Matches</a>
                <p className='dropdown-option' onClick={logoutUser}>Logout</p>
            </div>
        </div>
    );
}
 
export default NavBarDropdown;