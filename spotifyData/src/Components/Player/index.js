import React, { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

const Player = ({accessToken, trackUri}) =>{
    const [play, setPlay] = useState(false)
    // console.log(accessToken +" \n" +trackUri)

    useEffect(() =>{
        setPlay(true)
    },[trackUri])

    if(!accessToken) return null
    return(
        <SpotifyPlayer
            token={accessToken} 
            showSaveIcon
            uris={trackUri ? [trackUri] : []} 
            callback={state => {
                if(!state.isPlaying)setPlay(false)
            }}
            play={play}
        />
    )
}

export default Player