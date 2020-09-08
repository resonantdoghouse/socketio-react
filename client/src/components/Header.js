import React from 'react';

/*
 * <Header/>
 */
function Header({ numConnected }) {
  return (
    <header>
      <h1>Socket.io with React</h1>
      <p>Users connected: {numConnected}</p>
    </header>
  );
}

export default Header;
