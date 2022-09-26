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

const Dashboard = ({code}) => {
    const accessToken = useAuth(code)
    const [user, setUser] = useState()
    const [userPlaylists, setUserPlaylists] = useState()
    const [selectedPlaylist, setSelectedPlaylist] = useState()
    const [search, setSearch] = useState("")
    const [topResult, setTopResult] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchResultArtists, setSearchResultArtists] = useState([])
    const [trackToPlay, setTrackToPlay] = useState()
    const [showTracklist, setShowTracklist] = useState(false)
    const [selectedTracklistSongs, setSelectedTracklistSongs] = useState()
    const [selectedTracklistInfo,setSelectedTracklistInfo] = useState()

    const contextAllPlaylist = useRef()
    const contextPlaylist = useRef()
    const contextSongUri = useRef()
    const refs = useRef({contextAllPlaylist, contextSongUri, contextPlaylist})

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.setAccessToken(accessToken)

        spotifyApi.getMe().then((res) => {
            setUser(res.body)

            return res
        }, (err) => { 
            console.log('Something went wrong!' + err)
        }).then( res => 
            spotifyApi.getUserPlaylists(res.id, {limit : 30}).then(res => {
                contextAllPlaylist.current = res.body
                setUserPlaylists(res.body)                    
            },(err) => { console.log('Something went wrong!', err)
            })
        )
        
    }, [accessToken])

    useEffect(() => {
        if(!selectedPlaylist) return

        spotifyApi.getPlaylist(selectedPlaylist).then( res =>{
            setSelectedTracklistInfo({id: res.body.id, name: res.body.name, image: res.body.images[0].url})
            setSelectedTracklistSongs(
                res.body.tracks.items.map(track => {
                    if(track.track.album.images.length == 0) return

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
            setShowTracklist(true)
        })
    },[selectedPlaylist])

    useEffect(() => {
        if (!search) return setSearchResults([]), setSearchResultArtists([]),setTopResult([])
        if (!accessToken) return
        let cancel = false

        spotifyApi.searchTracks(search).then(res=>{
            if (cancel) return
            // console.log(res)
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
            setTopResult([
                {
                    id: res.body.artists.items[0].id,
                    name: res.body.artists.items[0].name,
                    followers: res.body.artists.items[0].followers.total.toLocaleString('US'),
                    image: res.body.artists.items[0].images[0].url
                }
            ])

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
    }, [search,accessToken])

    const chooseTrack = (track) => {
        setTrackToPlay(track)
    }

    const getPlaylistSongs = (uri) => {
        setShowTracklist(true)
        setSelectedPlaylist(uri)
    }
    
    const closeTracklist = (x) => {
        setShowTracklist(x)
    }
    return(
        <>
        <DashboardDiv>
            <DashboardChildren>   
                    {/* if user exists get user */}
                    {user !== undefined && <UserProfile user={user}/>}
                    
                    {/* if userPlaylists is not empty, return user playlist section*/}
                    {userPlaylists !== undefined && <>
                        <div style={{overflow: "scroll",maxHeight: 90+'%'}}>
                            
                            {/* Render individual playlist / onClick sets playlist ID to get songs */}
                            {userPlaylists.items.map( playlist => {  
                            return <UserPlaylists playlist={playlist} getPlaylistSongs={getPlaylistSongs}/>
                            })}
                        </div>
                    </>}
                    {/* EOF SIDEBAR */}
            </DashboardChildren>
            <DashboardChildren>
                    <div className='dashboard-search'>
                        <form type="search" value={search} placeholder="Search Songs/Artists" onChange={e=> setSearch(e.target.value)}>
                            <input type='text' className='input-field'/>
                        </form>
                    </div>
                    { showTracklist ? <Tracklist selectedTracklistInfo={selectedTracklistInfo} selectedTracklistSongs={selectedTracklistSongs} chooseTrack={chooseTrack} closeTracklist={closeTracklist} ref={refs}/> :
                    <div className='dashboard-results'>
                        <div className='flex' style={{height: 350+'px', marginBottom: 45+'px'}}>
                            <TopResult topResult={topResult}/>
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
                                    // console.log(searchResult)
                                )}
                            </div>
                        </div>
                    </div>
                    }
                    {/* EOF Main Section */}
            </DashboardChildren>
                {/* EOF Dashboard */}
        </DashboardDiv>
        <div className='dashboard-player'>    
            <Player accessToken={accessToken} trackUri={trackToPlay}></Player>
        </div>
        <ContextMenu chooseTrack={chooseTrack} ref={refs}/> 
        </>
        )
}
export default Dashboard

const DashboardDiv = styled.div`
    width: 100%;
    position: relative;
    height: 90vh;
    display: grid;
    grid-template-columns: 15% 85%;
    padding-top: 20px;
`

const DashboardChildren = styled.div`
padding: 0 15px;
max-height: 90vh;
overflow: scroll;
`
// const InnerDashboard = styled.div`
// display: grid;
// grid-template-columns: 15% 85%;
// padding-top: 20px;
// height: 90vh;
// `

const SearchContainer = styled.div`
margin-bottom: 15px;
`