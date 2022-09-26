import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import Modal from '../Modal';
import axios from 'axios';
import './styles.css'

const CardGrid = ({token}) => {
    
    const [elWidth, setElWidth] = useState(0);
    // const [openModal, setOpenModal] = useState(false);
    // const [modalId, setModalId] = useState()
    const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromApi: []});
    
    const ref = useRef(null);
    const baseUrl = 'https://api.spotify.com/v1';

    const axiosWithHeaders = axios.create({
        baseURL: baseUrl,
        headers: { 'Authorization' : 'Bearer ' + token},
    });

    useLayoutEffect(() => {
        setElWidth(ref.current.offsetWidth);
    }, [ref.current.offsetWidth]);

    if({token}){
        getSpotifyGenres() 
        console.log("Grid loaded")
    }else{
        console.log("Grid not loaded")
    }

    const getSpotifyGenres = () => {
        return axiosWithHeaders.get('https://api.spotify.com/v1/browse/categories?limit=50')
    }

    // useEffect( () => {
    //     axios('https://api.spotify.com/v1/browse/categories?limit=50', {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     })
    //     .then(res => {
    //         getGenres(res)
    //     })

    //     createGenreCards()
    // },[token]);

    const getGenres = (res) => {
        setGenres({
            selectedGenre: genres.selectedGenre,
            listOfGenresFromApi: res.data.categories.items
        })
    }

    const cardStyle={
        width: elWidth*0.23, 
        height: elWidth*0.2,
        position: "relative"
    }

    const createGenreCards = () =>{
        return genres.listOfGenresFromApi.map((genre,idx) => 
            <div key={idx} value={genre.id} style={cardStyle} 
            // onClick={() => modalTrigger(genre.id)}
            >
                <div className='overlay'>
                    <img className='cardImage' src={genre.icons[0].url} style={cardStyle}/>
                </div>
                <div className='cardTitle__container'>
                    <p className='cardTitle'>
                        {genre.name}
                    </p>
                </div>
            </div>
        )
    }
    
    // const modalTrigger = (id) => {
    //     setOpenModal(!openModal);
    //     setModalId(id);
    // }

    return(
        <div id='cardGrid' ref={ref}>
            {/* {openModal && <Modal modalId={modalId} token={token}/>} */}
            {createGenreCards()}
        </div>
    )
}

export default CardGrid;