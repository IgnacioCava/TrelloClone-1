import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { AuthContext } from '../../contexts/AuthStore';

const Navbar = () => {
  const {auth: {isAuthenticated}, dispatch} = useContext(AuthContext)

  if (!isAuthenticated) return ''
  return (
    <nav className='navbar'>
      <Link to='/dashboard'>Home</Link>
      <Link to='/dashboard'>TrelloClone</Link>
      <Link to='/' onClick={() => dispatch(logout())}>
        Logout
      </Link>
    </nav>
  )
}

export default Navbar;
