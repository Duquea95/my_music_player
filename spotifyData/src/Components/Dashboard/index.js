import React, { useState, useEffect, useRef } from 'react'
import useAuth from '../useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import ResultCard from '../ResultCard'
import Player from '../Player'
import './styles.css'
import Sidebar from '../Sidebar'
import TopResult from '../TopResult'
import Tracklist from '../Tracklist'
import ContextMenu from '../ContextMenu'
import styled, {css} from 'styled-components'

const spotifyApi = new SpotifyWebApi({
    clientId: "394758341b2147028b2ec9f669d38ba0"
});

const Dashboard = ({code}) => {
    const accessToken = useAuth(code);

    // User States
    const [user, setUser] = useState();
    const [userPlaylists, setUserPlaylists] = useState();
    
    // Sidebar Playlist, Displayed Tracklist, Player States
    const [selectedPlaylist, setSelectedPlaylist] = useState();
    const [selectedTracklistInfo,setSelectedTracklistInfo] = useState();
    const [selectedTracklistSongs, setSelectedTracklistSongs] = useState();
    const [trackToPlay, setTrackToPlay] = useState();
    
    // Search Form + All Search Result States
    const [search, setSearch] = useState("");
    const [topResult, setTopResult] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultArtists, setSearchResultArtists] = useState([]);
        
    // Track Uri ContextClick Ref
    const contextSongUri = useRef();
    const tracklistRef = useRef(null);
    const refs = useRef({contextSongUri,tracklistRef});

    const [playlistModified, setPlaylistModified] = useState();
    const [songToPlaylist, setSongToPlaylist] = useState();
    const [removeSongFromPlaylist,setRemoveSongFromPlaylist] = useState();
    const [showContextPlaylistOptions, setShowContextPlaylistOptions] = useState(false);

    const [isContextOpen, setIsContextOpen] = useState();
    const [openArtistResult, setOpenArtistResult] = useState(false);
    const [activeArtistResult, setActiveArtistResult] = useState();
    const [activeArtistAlbums ,setActiveArtistAlbums] = useState();
    const [selectedAlbum ,setSelectedAlbum] = useState();
    const [activeAlbumTracklist,setActiveAlbumTracklist] = useState();
    
    useEffect(() => {
        window.oncontextmenu = (event) => {
            console.log(event)
            console.log(refs.current.tracklistRef.current)

            if (refs.current.tracklistRef.current && refs.current.tracklistRef.current.contains(event.target)) {
                setShowContextPlaylistOptions(true)
            }
        }
    }, []);

    // Runs after render if accessToken changed on load.
    // Sets SpotifyToken, User Info, User Playlists
    useEffect(() => {
        if (!accessToken) return
        
        spotifyApi.setAccessToken(accessToken);

        spotifyApi.getMe().then((res) => {
            setUser(res.body)

            return res
        }, (err) => { 
            console.log('Something went wrong!' + err)
        }).then( res => 
            spotifyApi.getUserPlaylists(res.id, {limit : 30}).then(res => {
                setUserPlaylists(res.body.items)                    
            },(err) => { console.log('Something went wrong!', err)
            })
        )
        
    }, [accessToken])

    // Run after render if selectedPlaylist value is changed
    // Get songs from the selected playlist
    useEffect(() => {
        if(!selectedPlaylist) return

        spotifyApi.getPlaylist(selectedPlaylist).then( res =>{

            if(res.body.images[0].url !== undefined){
            setSelectedTracklistInfo({id: res.body.id, name: res.body.name, image: res.body.images[0].url})}
            else{
                setSelectedTracklistInfo({id: res.body.id, name: res.body.name})
            }
            
            setSelectedTracklistSongs(
                res.body.tracks.items.map(track => {
                    if(track.track.album.images == 0) return

                    let smallestAlbumImage = track.track.album.images.reduce(
                            (smallest, image) => {
                            if(image.height < smallest.height) return image
                            return smallest
                    },track.track.album.images[0])
                    return{
                        artist: track.track.artists[0].name,
                        title: track.track.name,
                        trackNumber: track.track.track_number,
                        uri: track.track.uri,
                        duration: track.track.duration_ms,
                        image: smallestAlbumImage.url,
                        addedAt: track.added_at,
                    }
                })
            )
        })
    },[selectedPlaylist, selectedTracklistSongs])

    // Run after render if Search form value is changed
    // Search artist,songs, & albums based on search value
    useEffect(() => {
        if (!search) return setSearchResults([]), setSearchResultArtists([]),setTopResult([])
        if (!accessToken) return
        let cancel = false

        spotifyApi.searchTracks(search).then(res=>{
            if (cancel) return
            console.log(res)
            setSearchResults( 
                res.body.tracks.items.map( track => {
                    // console.log(track)
                    let smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if(image.height < smallest.height) return image
                            return smallest
                        },
                    track.album.images[0])

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        image: smallestAlbumImage.url,
                        duration: track.duration_ms,
                    }
                })
            )
        }).catch(err => {console.log(err)})

        spotifyApi.searchArtists(search).then(res=>{
            if (cancel) return
            
            if(res.body.artists.items[0].images.length > 0 ){
                let smallestAlbumImage = res.body.artists.items[0].images.reduce(
                    (smallest, image) => {
                        if(image.height > smallest.height)return image;
                        
                        return smallest
                    },
                res.body.artists.items[0].images[0])
                setTopResult([{
                    id: res.body.artists.items[0].id,
                    name: res.body.artists.items[0].name,
                    followers: res.body.artists.items[0].followers.total.toLocaleString('US'),
                    image: res.body.artists.items[0].images[0].url
                }])
            }else{
                setTopResult([{
                    id : res.body.artists.items[0].id,
                    name: res.body.artists.items[0].name,
                    followers: res.body.artists.items[0].followers.total.toLocaleString('US')
                }])
            }

            setSearchResultArtists(
                res.body.artists.items.map(artist =>{
                    if(artist.images.length > 0 ){
                        let smallestAlbumImage = artist.images.reduce(
                            (smallest, image) => {
                                if(image.height < smallest.height) return image
                                return smallest
                            },
                        artist.images[0])
                        
                        return {
                            id: artist.id,
                            name: artist.name,
                            popularity: artist.popularity,
                            followers: artist.followers.total,
                            uri: artist.uri,
                            image: smallestAlbumImage.url
                        }
                    }else{
                        return{
                            id : artist.id,
                            name: artist.name,
                            popularity: artist.popularity,
                            followers: artist.followers.total,
                            uri: artist.uri
                        }
                    }
                })
            )
        })

        return () => (cancel = true)
    }, [search, accessToken])

    // Run after render if song selected to add
    useEffect(()=>{
        if(!songToPlaylist) return

        spotifyApi.addTracksToPlaylist(playlistModified, [songToPlaylist])
    },[songToPlaylist])

    // Run after render if song selected to remove
    useEffect(()=>{
        if(!removeSongFromPlaylist) return  

        spotifyApi.removeTracksFromPlaylist(selectedPlaylist, removeSongFromPlaylist)
    },[removeSongFromPlaylist])

    useEffect(() => {
        if(openArtistResult != true) return

        spotifyApi.getArtistAlbums(activeArtistResult.id).then(res => {
            setActiveArtistAlbums(res.body.items)
        })
    }, [activeArtistResult])

    useEffect(() => {
        if(!selectedAlbum) return
        console.log(selectedAlbum)

        spotifyApi.getAlbumTracks(selectedAlbum.id).then(res => {
            setActiveAlbumTracklist(res.body.items)
        })
    }, [selectedAlbum])

    // Sets TrackToPlay w/ Song URI (prop for Player component)
    // Function called from Tracklist & ContextMenu
    function chooseTrack(e, track) {
        switch (e.detail) {
        case 1: {
            break;
        }
        case 2: {
            console.log('double click');
            setTrackToPlay(track)
        }
        }
    }

    const getPlaylistSongs = (uri) => {
        setSelectedPlaylist(uri)
    }
    
    const closeTracklist = () => {
        setSelectedPlaylist(undefined)
    }
    const closeOpenArtistResult = () => {
        setOpenArtistResult(false)
    }
    const handleAddToPlaylist = (val) => {
        setSongToPlaylist(contextSongUri.current);
        setPlaylistModified(val);
    }
    const handleRemoveFromPlaylist = () => {
        setRemoveSongFromPlaylist([{uri: contextSongUri.current}]);
    }
    const handleSearchResultClick = (res) => {
        console.log(res)
        setActiveArtistResult(res)
        setOpenArtistResult(true);
    }
    const handleAlbumClick = (res) => {
        setSelectedAlbum(res)
    }
    const handleCloseAlbumTracklist = () =>{
        setActiveAlbumTracklist(undefined);
    }
    const handleHomeClick = () => {
        handleCloseAlbumTracklist();
        closeOpenArtistResult();
        setSearch()
    }
    
    return(
        <>
        <DashboardDiv>
            {(user && userPlaylists) && <Sidebar user={user} userPlaylists={userPlaylists} getPlaylistSongs={getPlaylistSongs} handleHomeClick={handleHomeClick}/>}
            <DashboardMainDiv>
                { selectedPlaylist ? <Tracklist selectedTracklistInfo={selectedTracklistInfo} selectedTracklistSongs={selectedTracklistSongs} chooseTrack={chooseTrack} closeTracklist={closeTracklist} ref={refs}/> :
                <>
                    { openArtistResult ?                    
                        activeAlbumTracklist ? <>
                            <AlbumTracklistHeader selectedAlbum={selectedAlbum} artistImage={activeArtistResult.image}/>
                            <AlbumTracklist activeAlbumTracklist={activeAlbumTracklist} handleCloseAlbumTracklist={handleCloseAlbumTracklist} chooseTrack={chooseTrack}/>
                        </> : <TopResultContainer>
                            <BackgroundImageDiv style={{backgroundImage: 'url('+activeArtistResult.image+')', height: 350+'px',width: 100+'%',position: 'absolute',zIndex: '-1'}}>
                            {/* <img src={topResult[0].image} /> */}
                            </BackgroundImageDiv>
                            <div style={{display: 'flex',alignItems: 'end', height: 350+'px'}}>
                                <div style={{padding: 50+'px'}}>
                                    <h1 style={{fontSize: 64+'px'}}>{activeArtistResult.name}</h1>
                                    <span>{activeArtistResult.followers} followers</span>
                                </div>
                            </div>
                            <div onClick={closeOpenArtistResult}><span>Close</span></div>
                            <ArtistDiscography activeArtistAlbums={activeArtistAlbums} handleAlbumClick={handleAlbumClick} />
                        </TopResultContainer>
                    : 
                    <SearchDiv>
                        <div>
                            <form type="search" value={search} placeholder="Search Songs/Artists" onChange={e=> setSearch(e.target.value)}>
                                <input type='text' className='input-field'/>
                            </form>
                        </div>
                        <div className='flex' style={{height: 350+'px', marginBottom: 45+'px'}}>
                        {topResult && <TopResult topResult={topResult} handleSearchResultClick={handleSearchResultClick}/>}
                        <div className='result-songs' style={{width: 450+'px'}}>
                            <div className='result-title'>
                                <p>Top Related Songs</p>
                            </div>
                            <div>
                            {searchResults !== undefined && searchResults.map(searchResult => 
                            <ResultCard cardType={"song"} result={searchResult} chooseTrack={chooseTrack}/>
                            )}
                            </div>
                        </div>
                        </div>
                        <div className='result-artists'>
                            <div style={{marginBottom: 25+'px'}}>
                                <p style={{fontSize: 24+'px'}}>Artists</p>
                            </div>
                            <div className='flex'>
                            {searchResultArtists !== undefined && searchResultArtists.map(searchResult => 
                            <ResultCard cardType={"artist"} result={searchResult} handleSearchResultClick={handleSearchResultClick}/>
                            )}
                            </div>
                        </div>
                    </SearchDiv>
                    }
                </>
                }
                {/* EOF Main Section */}
            </DashboardMainDiv>
            {/* EOF Dashboard */}
        </DashboardDiv>
        <div className='dashboard-player'>    
            <Player accessToken={accessToken} trackUri={trackToPlay}></Player>
        </div>
        <ContextMenu playlists={userPlaylists} showContextPlaylistOptions={showContextPlaylistOptions} chooseTrack={chooseTrack} handleAddToPlaylist={handleAddToPlaylist} handleRemoveFromPlaylist={handleRemoveFromPlaylist} ref={refs}/> 
        </>
        )
}
export default Dashboard

const ArtistDiscography = (props) => {
    return(
        <div>
            <RowHead>
                <div><span>Discography</span></div>
                <div><span>See All</span></div>
            </RowHead>
            <div className='flex' style={{overflow: 'scroll'}}>
                {props.activeArtistAlbums && props.activeArtistAlbums.map(res => {
                    return (
                    <div onClick={e => props.handleAlbumClick(res)}>
                        <div><img width={150} src={res.images[0].url} />
                        </div>
                        <div>
                            <span>{res.name}</span>
                        </div>
                    </div>)
                })}
            </div>
        </div>
    )
}
const AlbumTracklistHeader = (props) =>{
    if(!props.selectedAlbum) return

    console.log('header ' + props.selectedAlbum)
    return(
        <AlignCenterDiv style={{padding: 25+'px '+0}}>
            <div><img width={250} src={props.selectedAlbum.images[0].url}/></div>
            <div style={{padding: 0 +' ' + 25+'px'}}>
                <div><StyledSubSpan>{props.selectedAlbum.album_type}</StyledSubSpan></div>
                <div><TitleDiv as="h1" style={{color: 'white'}}>{props.selectedAlbum.name}</TitleDiv></div>
                <AlignCenterDiv><span><StyledMiniImg src={props.artistImage}/></span> <span>{props.selectedAlbum.artists.map(artist => {return artist.name})}</span> • <span>{props.selectedAlbum.release_date.split('-')[0]
}</span> • <span>{props.selectedAlbum.total_tracks} songs</span></AlignCenterDiv>
            </div>
        </AlignCenterDiv>
    )
}
const AlbumTracklist = (props) => {
    if(!props.activeAlbumTracklist) return

    console.log(props)
    return( 
        <>
        <div onClick={props.handleCloseAlbumTracklist}><span>Close</span></div>
        <div>
            <SongDiv>
                <AlignCenterDiv style={{width: 50+'%'}}>
                    <div style={{width: 50+'px', textAlign: 'center'}}>
                        <span>#</span>
                    </div>
                    <div style={{width: 250+'px'}}>
                        <span>Title</span>
                    </div>
                </AlignCenterDiv>
                <div>
                    <span>Duration</span>
                </div>
            </SongDiv>
            {props.activeAlbumTracklist.map(res =>{ return (
                <SongDiv onClick={e => props.chooseTrack(e, res.uri)}>
                    <AlignCenterDiv style={{width: 50+'%'}}>
                        <div style={{width: 50+'px', textAlign: 'center'}}>
                            <p>{res.track_number}</p>
                        </div>
                        <div style={{width: 250+'px'}}>
                            <p>{res.name}</p>
                            <AlignCenterDiv>{res.explicit && <ExplicitSpan>E</ExplicitSpan>} <span style={{fontSize: 12+'px',padding: 1+'px '+0}}>{res.artists.map((res, idx) => idx == 0 ? res.name : ', '+res.name)}</span></AlignCenterDiv>
                        </div>
                    </AlignCenterDiv>
                    <div>
                        <div><p>{parseFloat((res.duration_ms/1000)/60).toFixed(2)}</p></div>
                    </div>
                </SongDiv>
            )})}
        </div>
        </>
    )
}
const RowHead = styled.div`
display: flex;
justify-content: space-between;
`
const TopResultContainer = styled.div`
position:relative;
`
const DashboardDiv = styled.div`
width: 100%;
position: relative;
height: 93vh;
display: grid;
grid-template-columns: 15% 85%;
`
const DashboardChildDiv = styled.div`
padding: 0 15px;
max-height: 93vh;
`
const SideBarDiv = styled(DashboardChildDiv)`
padding: 25px 15px;
`
const DashboardMainDiv = styled(DashboardChildDiv)`
padding-right: 0;
overflow:scroll;
`
const SearchDiv =  styled.div`
padding: 25px 15px;
`
const BackgroundImageDiv = styled.div`
background-size:cover;
background-repeat:no-repeat;
background-position:center;

left: 0;
right: 0;

`
const SearchContainer = styled.div`
margin-bottom: 15px;
`
const FlexDiv = styled.div`
display: flex;
`
const SongDiv = styled(FlexDiv)`
    padding: 10px 0;
    align-items: center;
    &:hover{
        background: rgba(255,255,255,.4);
    }
`
const AlignCenterDiv = styled(FlexDiv)`
align-items: center;
`
const TitleDiv = styled.div`
font-size: 42px;
`
const StyledMiniImg= styled.img`
width: 25px;
border-radius: 25px;
margin-right: 10px;
`
const StyledSubSpan= styled.span`
font-size: 10px;
text-transform: uppercase;
`
const ExplicitSpan = styled.span`
color: #1f1f1f;
background: #fff;
padding: 1px 3px;
border-radius: 2px;
font-size: 8px;
margin-right: 5px;
`