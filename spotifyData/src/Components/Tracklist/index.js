import {ref, forwardRef, useEffect} from 'react'
import ContextMenu from '../ContextMenu'
import styled from 'styled-components'

const Tracklist = forwardRef((props, ref) =>{
    const focusInput = (e, res) =>{
        ref.current.contextSongUri.current = res.uri;
    }

    if(props.selectedTracklistSongs === undefined) return

    return(<>
        <div onClick={props.closeTracklist}>Close</div>
        <div>
            <div>
                <TracklistInfo className="flex">
                    <img width={200} src={props.selectedTracklistInfo.image}/>
                    <h1>{props.selectedTracklistInfo.name}</h1>
                </TracklistInfo>
            </div>
            <div ref={ref.current.tracklistRef}>
                {props.selectedTracklistSongs.map( (res,idx) => {
                    idx++; 
                    return(
                        <>
                        <Song onContextMenu={(e) => focusInput(e,res)} onClick={e => props.chooseTrack(res.uri)} key={res.uri}>
                            <div><span>{idx}</span></div>
                            <div><img src={res.image} /></div>
                            <SongText><p>{res.title}</p></SongText>
                            <div><p>{res.artist}</p></div>
                            <div><span>{res.addedAt}</span></div>
                            <div><p>{parseFloat((res.duration/1000)/60).toFixed(2)}</p></div>
                        </Song>
                        </>
                    )
                })}
            </div>
        </div>
    </>)
})

export default Tracklist

const TracklistInfo = styled.div`
    margin-bottom: 35px
`
const Song = styled.div`
display: grid;
grid-template-columns: 2% 5% 30% 25% 20% 15%;
// justify-content: space-between;
align-items: center;
position: relative
`
const SongText= styled.div`padding-left: 25px`