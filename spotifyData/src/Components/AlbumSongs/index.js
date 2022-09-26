import React from 'react'

const AlbumSongs = ({name, trackNumber}) => {
    const createSongName = () => {
        return <div className='resultCard-text' style={{padding: "15px 0"}}><p>{trackNumber}. {name}</p></div>
    }

    const createSongs = () =>{
        return (
            <div className='component-albumSong'>
                <div className='flex album-resultCard'>
                    {createSongName()}
                </div>
            </div>
        )
    }

    return (<>{createSongs()}</>)
}

export default AlbumSongs