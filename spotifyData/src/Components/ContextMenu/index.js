import {useState, forwardRef,useEffect } from "react";
import useContextMenu from "../useContextMenu";
import styled from 'styled-components'

const ContextMenu = forwardRef((props,ref) => {
    const [showSubContext, setShowSubContext] = useState(false);
    const { anchorPoint, show } = useContextMenu();
    
    const handleHoverParent = (val) => {
        console.log(props)
        setShowSubContext(val)
    };

    if (show && props.showContextPlaylistOptions){
        return (
        <>
        <ContextMenuList style={{ top: anchorPoint.y, left: anchorPoint.x }} onMouseLeave={e => handleHoverParent(false)}>
            <MenuListItem onClick={e => props.chooseTrack(ref.current.contextSongUri.current)}>Play</MenuListItem>
            <MenuListItem>Add To Queue</MenuListItem>
            <hr className="divider" />
            <MenuListItem onMouseOver={e => handleHoverParent(true)}>
            Add to playlist
            {showSubContext &&
                <ContextSubMenuDiv>
                {props.playlists.map(res=>{
                    return  (
                    console.log(res),
                    <MenuListItem key={res.uri} 
                    onClick={e => props.handleAddToPlaylist(res.id)} style={{color: 'black'}}>{res.name}
                    </MenuListItem>
                    )
                })}
                </ContextSubMenuDiv>
            }
            </MenuListItem>
            <MenuListItem onClick={props.handleRemoveFromPlaylist}>Remove from playlist</MenuListItem>
            <hr className="divider" />
            <MenuListItem>Exit</MenuListItem>
        </ContextMenuList>
        </>)
    }
    return <></>;
});

export default ContextMenu;

// Styled Components
const ContextMenuList = styled.ul`
    font-size: 14px;
    background-color: #fff;
    border-radius: 2px;
    width: 150px;
    margin: 0 0 0 150px;
    height: auto;
    margin: 0;
    /* use absolute positioning  */
    position: absolute;
    list-style: none;
    box-shadow: 0 0 20px 0 #ccc;
    opacity: 1;
    transition: opacity 0.5s linear;
    z-index: 4;
    
    cursor: pointer;
` 
const MenuListItem = styled.li`
padding: 5px 10px;
`
const ContextSubList = styled(MenuListItem)`
position:relative;
`
const ContextSubMenuDiv = styled.div`
font-size: 14px;
background-color: #fff;
border-radius: 2px;
padding: 5px 0 5px 0;
width: 150px;
height: auto;
margin: 0;

z-index: 5;
top: 0;
left: 150px;

position: absolute;
list-style: none;
box-shadow: 0 0 20px 0 #ccc;
opacity: 1;
transition: opacity 0.5s linear;
`