import { forwardRef,useEffect } from "react";
import useContextMenu from "../useContextMenu";
import styled from 'styled-components'

const ContextMenu = forwardRef((props,ref) => {
    const { anchorPoint, show } = useContextMenu()
    
    useEffect(()=>{
        console.log(ref)
        // console.log(props)
        console.log(ref.current)
    },[show])
  
    const addToPlaylist = () =>{
        return ref.current.contextAllPlaylist.current.items.map( res =>{
          <div>{res.name}</div>
    })}

    const contextSubMenu = () =>{
        console.log(ref)
        return(
            <div>
                {ref.current.contextAllPlaylist.current.items.map( res => {
                  <div>{res.name}</div>
                })}
            </div>
    )}

    const handlePlay = (e, uri) => {
        props.chooseTrack(uri)
    }

    if (show){
        return (
        <>
        <ContextMenuContainer style={{ top: anchorPoint.y, left: anchorPoint.x }}>
            <li onClick={e => handlePlay(e,ref.current.contextSongUri.current.uri)}>Play</li>
            <li>Add To Queue</li>
            <hr className="divider" />
            <li>
              Add to playlist
              <div>{contextSubMenu()}</div>
            </li>
            <li>Remove from playlist</li>
            <hr className="divider" />
            <li>Exit</li>
        </ContextMenuContainer>
        {/* <ContextSubMenu /> */}
        </>)
    }
    return <></>;
});

export default ContextMenu;

const ContextMenuContainer = styled.ul`
    font-size: 14px;
    background-color: #fff;
    border-radius: 2px;
    padding: 5px 0 5px 0;
    width: 150px;
    height: auto;
    margin: 0;
    /* use absolute positioning  */
    position: absolute;
    list-style: none;
    box-shadow: 0 0 20px 0 #ccc;
    opacity: 1;
    transition: opacity 0.5s linear;
` 