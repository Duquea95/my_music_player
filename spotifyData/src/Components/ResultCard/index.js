import React from 'react'
import './styles.css'

const ResultCard = (props) => {
    const handlePlay = (e) => {
        if(props.cardType == 'artist') return

        props.chooseTrack(e,props.result.uri);
    }
    const handleArtistClick = () => {
        props.handleSearchResultClick(props.result);
    }
    return(
        <div className={"resultCard"+ (props.cardType === 'song' ? ' flex songCard' : ' artistCard')} style={props.cardType === 'song' ? {width: 100+'%',justifyContent: 'space-between'} : {}} onClick={props.cardType == "artist" ? handleArtistClick : handlePlay}>
            <div className={props.cardType == 'song' ? 'flex': ''}>
                <div style={props.cardType == 'artist' ? {marginBottom: 10+'px'}: {}}>
                    <img className={props.cardType == 'song' ? 'song-image' : 'artist-image'} src={props.result.image}/>
                </div>
                <div style={props.cardType == 'song' ? {paddingLeft: 15+'px'}: {}}>
                    <p >{props.cardType === 'song' ? props.result.title : props.result.name}</p>
                </div>
                <div>
                    <p className='resultCard-subText'>{props.cardType === 'song' ? props.result.artist : props.result.followers}</p>
                </div>
            </div>
            {props.cardType === 'song' &&
            <div>
                <span className='resultCard-subText'>{parseFloat((props.result.duration/1000)/60).toFixed(2)}</span>
            </div>}
        </div>
    )
}

export default ResultCard;