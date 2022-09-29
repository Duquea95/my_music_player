import React from 'react';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import styled, {css} from 'styled-components'
import './index.css';


const App = () => {

    const code = new URLSearchParams(window.location.search).get('code')
    return(
        <div style={code ? {} : {display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100+'vh'}}>
            {code ? <Dashboard code={code}/> : <Login/> }
        </div>
    )
}

export default App