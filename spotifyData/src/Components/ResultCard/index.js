import React from 'react'
import './styles.css'

// const ResultCard = ({cardType, name, image, title, uri, followers,duration, chooseTrack}) => {
const ResultCard = ({cardType, result, chooseTrack}) => {
    const handlePlay = () => {
        if(cardType == 'artist') return
        chooseTrack(result.uri)
    }
    return(
        <div className={"resultCard"+ (cardType === 'song' ? ' flex' : '')} style={{width: 100+'%', justifyContent: 'space-between'}} onClick={handlePlay}>
            <div className={cardType == 'song' ? 'flex': ''}>
                <div>
                    <img className={cardType == 'song' ? 'song-image' : 'artist-image'} src={result.image}/>
                </div>
                <div style={cardType == 'song' ? {paddingLeft: 15+'px'}: {}}>
                    <p >{cardType === 'song' ? result.title : result.name}</p>
                </div>
                <div>
                    <p className='resultCard-subText'>{cardType === 'song' ? result.artist : result.followers}</p>
                </div>
            </div>
            <div>
                <span className='resultCard-subText'>{cardType === 'song' ? parseFloat((result.duration/1000)/60).toFixed(2) : result.followers}</span>
            </div>
        </div>
    )
}

export default ResultCard;