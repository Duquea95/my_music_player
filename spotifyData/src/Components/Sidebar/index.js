import styled from 'styled-components'

const Sidebar = (props) =>{
    const handlePlaylists = (id) => {
        props.getPlaylistSongs(id)
    }

    return(
        <SideBarDiv>
            <StyledDiv> 
                <div className='result-title' style={{marginBottom: 30+'px'}}>
                    {/* <div style={{marginBottom: 25+'px'}}><p>{props.user.display_name}</p></div> */}
                    <div onClick={props.handleHomeClick} style={{marginBottom: 10+'px'}}><span>Home</span></div>
                    <div style={{marginBottom: 10+'px'}}><span>Search</span></div>
                </div>
                <div>
                    <div style={{marginBottom: 10+'px'}}><span>Create Playlist</span></div>
                </div>
            </StyledDiv>
            <div style={{overflow: "scroll",maxHeight: 75+'%'}}>
                {props.userPlaylists.map( playlist => { 
                return (
                    <div style={{marginBottom: 10+'px'}}>
                        <p style={{cursor: 'pointer'}} onClick={e => handlePlaylists(playlist.id)}>{playlist.name}</p>
                    </div>
                )})}
            </div>
        </SideBarDiv>
        )

}

export default Sidebar

const StyledDiv = styled.div`
border-bottom: 1px solid grey;
margin-bottom: 15px;
`
const SideBarDiv = styled.div`
padding: 25px 15px;

position: relative;
height: 93vh;
`