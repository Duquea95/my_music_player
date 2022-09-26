import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styles.css'
import ResultAlbums from '../ResultAlbums'
// import ResultArtists from '../ResultArtists'
import AlbumSongs from '../AlbumSongs'


const Search = ({token}) => {
    const [searchResultArtists, setSearchResultArtists] = useState()
    const [searchResultAlbums, setSearchResultAlbums] = useState()
    const [selectedAlbumSongs, setSelectedAlbumSongs] = useState()
    const [userVals, setUserVals] = useState({
        loadSearch: false,    
        searchVal: ""
    })
    const baseUrl = 'https://api.spotify.com/v1'
    
    useEffect( () => { if(userVals.searchVal != ""){getSpotifyData()} },[userVals.searchVal])

    const axiosWithHeaders = axios.create({
        baseURL: baseUrl,
        headers: { 'Authorization' : 'Bearer ' + token},
    });

    const createArtistParams = () => {
        axiosWithHeaders.interceptors.request.use((config) => {
            config.params = { q: userVals.searchVal, type: 'artist',...config.params, limit: 10,};
        return config
    })}
    
    const getSpotifyData = () => {
        getSearchResultArtists().then(res => {
            setSearchResultArtists(res.data.artists.items)
            return res.data.artists.items[0].id
        }).catch(err => setSearchResultAlbums(null),setSelectedAlbumSongs(null))
        .then(res => {
            getSearchResultAlbums(res)
        }).catch(err => setSearchResultAlbums(null))
    }

    const startSearch = (e) => {
        e.preventDefault()
        let newObj = {loadSearch: true,searchVal: e.target[0].value}
        setUserVals(newObj)
    }

    const getSearchResultArtists = () => {
        let params = null;

        createArtistParams(params);
        return axiosWithHeaders.get('/search',{params});
    }

    const getSearchResultAlbums = (res) => {
        axiosWithHeaders.get('/artists/'+res+'/albums')
            .then(res => { setSearchResultAlbums(res.data.items)})
    }

    const getSearchResultText = () => {
        return searchResultArtists ? <p>{updateSearchResultText()}</p> : <p>Search For An Artist, Album, Etc...</p>
    }
    
    const updateSearchResultText = () => {
        if(searchResultArtists.length != 0){return "Search Results for: " + userVals.searchVal}
        else{return "Your search didn't return any results. Please, try again."}
    }

    const handleAlbumClick = (e, id) => {
        getAlbumSongs(id)
    }

    const getAlbumSongs = (id) => {
        return axiosWithHeaders.get(baseUrl+'/albums/'+id)
        .then(res => setSelectedAlbumSongs(res.data.tracks.items))
        .catch(err => console.log(err))
    }

    const handleArtistClick = (e, id) => {
        setSelectedAlbumSongs(null)
        getSearchResultAlbums(id)
    }

    // const accessToken = useAuth(code)
    // const [search,setSearch] = useState()
    
    return(
        <div className='component-search'>
            <div className='search-results'>
                <div>      
                    {/* <form type="search" value={search} placeholder="Search Songs/Artists" onChange={setSearch}>
                        <input type='text' className='input-field'/>
                        <button type='Submit'>Search</button>
                    </form> */}
                    {/* <div>
                        <p>{getSearchResultText()}</p>
                    </div> */}
                </div>
                {/* <div className='flex results'>
                    <div className='result-artists'>
                    {searchResultArtists && searchResultArtists.map((val,idx) => 
                        <div key={idx} onClick={event => handleArtistClick(event, val.id)}>
                            <ResultArtists name={val.name} image={val.images[0].url} followers={val.followers.total} />
                        </div>
                    )}
                    </div>
                    <div className='result-albums'>
                        {searchResultAlbums && searchResultAlbums.map((val,idx) => 
                        <div key={idx} onClick={event => handleAlbumClick(event, val.id)}>
                            <ResultAlbums name={val.name} image={val.images[0].url}/>
                        </div>
                        )}
                    </div>
                    <div className='albumSongs'>
                        {selectedAlbumSongs && selectedAlbumSongs.map((val,idx) => 
                        <div key={idx} className='result-songs'>
                            {console.log(val)}
                            <AlbumSongs name={val.name} trackNumber={val.track_number}/>
                        </div>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Search;