import React, { useState, useEffect, useRef } from 'react'
import useAuth from '../useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import ResultCard from '../ResultCard'
import Player from '../Player'
import './styles.css'
import UserProfile from '../UserProfile'
import UserPlaylists from '../UserPlaylists'
import TopResult from '../TopResult'
import Tracklist from '../Tracklist'
import ContextMenu from '../ContextMenu'
import styled, {css} from 'styled-components'

const spotifyApi = new SpotifyWebApi({
    clientId: "394758341b2147028b2ec9f669d38ba0"
})

let count = 0

const Dashboard = ({code}) => {
    const accessToken = useAuth(code)

    // User States
    const [user, setUser] = useState()
    const [userPlaylists, setUserPlaylists] = useState()
    
    // Sidebar Playlist, Displayed Tracklist, Player States
    const [selectedPlaylist, setSelectedPlaylist] = useState()
    const [selectedTracklistInfo,setSelectedTracklistInfo] = useState()
    const [selectedTracklistSongs, setSelectedTracklistSongs] = useState()
    const [trackToPlay, setTrackToPlay] = useState()
    
    // Search Form + All Search Result States
    const [search, setSearch] = useState("")
    const [topResult, setTopResult] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchResultArtists, setSearchResultArtists] = useState([])
        
    // Track Uri ContextClick Ref
    const contextSongUri = useRef()
    const tracklistRef = useRef(null)
    const refs = useRef({contextSongUri,tracklistRef})

    const [playlistModified, setPlaylistModified] = useState()
    const [songToPlaylist, setSongToPlaylist] = useState()
    const [removeSongFromPlaylist,setRemoveSongFromPlaylist] = useState()
    const [showContextPlaylistOptions, setShowContextPlaylistOptions] = useState(false)

    const [isContextOpen, setIsContextOpen] = useState()
    const [openTopResult, setOpenTopResult] = useState(false)
    const [activeArtistAlbums ,setActiveArtistAlbums] = useState();
    
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
                setUserPlaylists(res.body)                    
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
    }, [search])

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
        if(openTopResult != true) return

        spotifyApi.getArtistAlbums(topResult[0].id).then(res => {
            setActiveArtistAlbums(res.body.items)
        })
    }, [openTopResult])

    // Sets TrackToPlay w/ Song URI (prop for Player component)
    // Function called from Tracklist & ContextMenu
    function chooseTrack(track) {
        setTrackToPlay(track)
    }

    const getPlaylistSongs = (uri) => {
        setSelectedPlaylist(uri)
    }
    
    const closeTracklist = () => {
        setSelectedPlaylist(undefined)
    }
    const closeOpenTopResult = () => {
        setOpenTopResult(false)
    }

    const handleAddToPlaylist = (val) => {
        setSongToPlaylist(contextSongUri.current);
        setPlaylistModified(val);
    }

    const handleRemoveFromPlaylist = () => {
        setRemoveSongFromPlaylist([{uri: contextSongUri.current}]);
    }

    const handleTopResultClick = () => {
        setOpenTopResult(true);
        console.log('handled ' + topResult[0].id );
    }
    
    return(
        <>
        <DashboardDiv>
            <SideBarDiv>   
                {/* if user is not empty, get user */}
                {user !== undefined && <UserProfile user={user}/>}
                    
                {/* if userPlaylists is not empty, return user playlist section*/}
                {userPlaylists !== undefined && <>
                    <div style={{overflow: "scroll",maxHeight: 90+'%'}}>
                            
                        {/* Render individual playlist / onClick sets playlist ID to get songs */}
                        {userPlaylists.items.map( playlist => {  
                        return <UserPlaylists key={playlist.id} playlist={playlist} getPlaylistSongs={getPlaylistSongs}/>
                        })}
                    </div>
                </>}
                {/* EOF SIDEBAR */}
            </SideBarDiv>
            <DashboardMainDiv>
                { selectedPlaylist ? <Tracklist selectedTracklistInfo={selectedTracklistInfo} selectedTracklistSongs={selectedTracklistSongs} chooseTrack={chooseTrack} closeTracklist={closeTracklist} ref={refs}/> :
                <>
                <div>
                    { openTopResult ?                    <TopResultContainer>
                        {console.log(topResult[0].image)}
                        <BackgroundImageDiv style={{backgroundImage: 'url('+topResult[0].image+')', height: 250+'px'}}>
                            {/* <img src={topResult[0].image} /> */}
                            <h1>{topResult[0].name}</h1>
                            <span>{topResult[0].followers}</span>
                        </BackgroundImageDiv>
                        <RowHead className='flex'>
                            <div onClick={closeOpenTopResult}><span>Close</span></div>
                            <div><span>See All</span></div>
                        </RowHead>
                        <div>
                            <h4><span>Discography</span></h4>
                            <div className='flex' style={{overflow: 'scroll'}}>
                                {activeArtistAlbums && activeArtistAlbums.map(res => {
                                    return <div>
                                        <div><img width={150} src={res.images[0].url} /></div>
                                        <div>
                                            <span>{res.name}
                                        </span>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </TopResultContainer>
                    :
                    <SearchDiv>
                        <div>
                            <form type="search" value={search} placeholder="Search Songs/Artists" onChange={e=> setSearch(e.target.value)}>
                            <input type='text' className='input-field'/>
                            </form>
                        </div>
                        <div className='flex' style={{height: 350+'px', marginBottom: 45+'px'}}>
                            <TopResult topResult={topResult} handleTopResultClick={handleTopResultClick}/>
                            <div className='result-songs' style={{width: 400+'px'}}>
                                <div className='result-title'>
                                    <p>Top Related Songs</p>
                                </div>
                                <div className=''>
                                {searchResults !== undefined && searchResults.map(searchResult => 
                                    <ResultCard cardType={"song"} result={searchResult} chooseTrack={chooseTrack}/>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className='result-artists'>
                            <div className='result-title'>
                                <p>Related Artists</p>
                            </div>
                            <div className='flex'>
                                {searchResultArtists !== undefined && searchResultArtists.map(searchResult => 
                                    <ResultCard cardType={"artist"} result={searchResult}/>
                                )}
                            </div>
                        </div>
                    </SearchDiv>
                    }
                </div>
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

const RowHead = styled.div`
display: flex;
justify-content: space-between;
`
const TopResultContainer = styled.div`
`
const DashboardDiv = styled.div`
width: 100%;
position: relative;
height: 93vh;
display: grid;
grid-template-columns: 15% 85%;
`
const DashboardChildren = styled.div`
padding: 0 15px;
max-height: 93vh;
`
const SideBarDiv = styled(DashboardChildren)`
padding: 25px 15px;
`
const DashboardMainDiv = styled(DashboardChildren)`
padding-right: 0;
`

const SearchDiv =  styled.div`
padding: 25px 15px;
`

const BackgroundImageDiv = styled.div`
background-size:cover;
background-repeat:no-repeat;
background-position:center;
`
const SearchContainer = styled.div`
margin-bottom: 15px;
`