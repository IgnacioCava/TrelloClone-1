import React, { useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getBoards } from '../../actions/board';
import CreateBoard from '../other/CreateBoard';
import Navbar from '../other/Navbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AuthContext } from '../../contexts/AuthStore';
import { BoardContext } from '../../contexts/BoardStore';
import { board } from '../../reducers/board';

const Dashboard = () => {
  const {auth: {user, isAuthenticated}} = useContext(AuthContext)
  const {board, boardDispatch} = useContext(BoardContext)

  useEffect(() => {
    if(!board.boards)boardDispatch(getBoards());
  }, [boardDispatch, board?.boards]);

  useEffect(() => {
    document.title = 'Your Boards | TrelloClone';
  }, []);

  console.log(board?.boards)

  if (!isAuthenticated) return <Redirect to='/' />
  return (
    <div className='dashboard-and-navbar'>
      <Navbar />
      <section className='dashboard'>
        <h1>Welcome {user && user.name}</h1>
        <h2>Your Boards</h2>
        {board?.loading && <CircularProgress className='dashboard-loading' />}
        <div className='boards'>
          {board.boards.map((board) => (
            <Link key={board._id} to={`/board/${board._id}`} className='board-card'>
              {board.title}
            </Link>
          ))}
          <CreateBoard />
        </div>
      </section>
    </div>
  ) 
};

export default Dashboard;
