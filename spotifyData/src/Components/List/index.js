import React,{useState, useEffect} from 'react';
import axios from 'axios';
import ListItems from '../ListItems';
import './styles.css';

const List = ({token}) => {
    const [newSingles, setNewSingles] = useState([]);
    const [newAlbums, setNewAlbums] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [showNew, setShowNew] = useState(false);

    const getNewReleases = () =>{
        axios('https://api.spotify.com/v1/browse/new-releases?limit=50',{
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).then(res => {filterNewReleases(res.data.albums.items)})
    }
    const filterNewReleases = (items) => {
        items.map(item => {
            if(item.album_type === "single"){setNewSingles( newSingles => ([...newSingles, item]))}
            else{setNewAlbums( newAlbums => ([...newAlbums, item]))}
        })
    }

    useEffect( () => {
        if(token){
            getNewReleases()
        }
    },[token, newReleases]);

    return(
        <div className='component-list'>
            <div className='list'>
                <p className='list-title'>New Released Singles</p>
                <ListItems item={newSingles} />
            </div>
            <div className='list'>
                <p className='list-title'>New Released Albums</p>
                <ListItems item={newAlbums} />
            </div>
        </div>
    )
}

export default List;