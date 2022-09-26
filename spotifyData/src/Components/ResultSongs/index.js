import React from 'react'
import './styles.css'

const ResultSongs = ({name, image, followers}) => {    

    // const getSongsImage = () => {
    //     return <div className='resultSongs-img'>{image ? <img src={image} alt={name}/> : <img alt={name} src={null} />}</div>
    // }
    // const getSongsName = () => {
    //     return(
    //         <div className='resultSongs-text'>
    //             <p className='resultSongs-mainText'>{name}</p>
    //             <p className='resultSongs-subText'>Followers: {followers}</p>                        
    //         </div>
    //     )
    // }
    
    const createResultSongs = () => {
        return (
            <div className='component-resultSongs'>
                <div className='flex songs-resultSongs'>

                </div>
            </div>
        )
    }

    return(<>{createResultSongs()}</>)
}

export default ResultSongs;