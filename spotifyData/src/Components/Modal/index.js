import React,{useState, useEffect} from 'react';
import axios from 'axios';

const Modal = ({modalId, token}) => {

    // useEffect( () => {
    //     axios('https://api.spotify.com/v1/browse/new-releases?limit=50',{
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     })
    //     .then(res => {
    //         // console.log(res.data)
    //     })
    // });

    return(
        <>
            <p>{modalId}</p>
        </>
    )
}

export default Modal;