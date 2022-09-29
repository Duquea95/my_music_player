// import React from "react"

const UserPlaylists = ({playlist, getPlaylistSongs}) =>{

    const handlePlaylists = () => {
        getPlaylistSongs(playlist.id)
    }

    if(playlist !== undefined)
    return(
        <div style={{marginBottom: 10+'px'}}>
            <p style={{cursor: 'pointer'}} onClick={handlePlaylists}>{playlist.name}</p>
        </div>
        )

}

export default UserPlaylists