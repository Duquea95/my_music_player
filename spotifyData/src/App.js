import React, {useState, useEffect,useCallback} from 'react';
import { Credentials } from './Credentials';
import Dropdown from './Components/Dropdown';
import CardGrid from './Components/CardGrid';
import List from './Components/List';
import Search from './Components/Search';
import axios from 'axios';
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