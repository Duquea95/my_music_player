import { useState, useEffect } from 'react'
import styled from 'styled-components'

const UserProfile = ({user}) => {
    return(
        <SidebarUser> 
            <div className='result-title' style={{marginBottom: 15+'px'}}>
                <p>{user.display_name}</p>
            </div>
        </SidebarUser>
    )
}

export default UserProfile

const SidebarUser = styled.div`
border-bottom: 1px solid grey;
margin-bottom: 15px;
`