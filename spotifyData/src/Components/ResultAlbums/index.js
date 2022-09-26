import React from 'react'
import './styles.css'

const ResultAlbums = ({name, image}) => {
    const createAlbumName = () => {
        return <div className='resultCard-text'><p>{name}</p></div>
    }
    const createAlbumImage = () => {
        return <div className='resultCard-img'><img src={image} /></div>
    }

    const createAlbums = () =>{
        return (
            <div className='component-albumCard'>
                <div className='flex album-resultCard'>
                    {createAlbumImage()}
                    {createAlbumName()}
                </div>
            </div>
        )
    }

    return (<>{createAlbums()}</>)
}

export default ResultAlbums;