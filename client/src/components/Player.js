import React from 'react';

/*
 * <Player />
 */
const Player = function ({ name, id, darkMode, socket }) {
  function handleLikeClick() {
    socket.emit('likeClicked', id);
  }

  return (
    <div className={`card text-center ${darkMode && `bg-dark`}`}>
      <h5 className="card-title">{name}</h5>
      <button className="btn btn-primary" id={id} onClick={handleLikeClick}>
        &hearts;
      </button>
    </div>
  );
};

export default Player;
