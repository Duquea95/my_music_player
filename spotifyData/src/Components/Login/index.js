import React from 'react'
import styled from 'styled-components'

const AUTH_URL = 'http://accounts.spotify.com/authorize?client_id=394758341b2147028b2ec9f669d38ba0&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private'

const Button = styled.a`
    background: rgba(0,200,0,.6);
    padding: 20px 25px;
    border: none;
    border-radius: 10px;
    color: white;
    text-decoration: none;
`
const Login = () =>{
    return(
        <div>
            <Button href={AUTH_URL}>Login To Spotify</Button>
        </div>
    )
}

export default Login