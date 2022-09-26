import React,{useState, useEffect} from 'react'

const ListItems = ({item}) => {
    // console.log(item)
    return(
        <div className='listItems__component'>
            {item.map((item,idx) => 
                <div className='listItem' key={(idx)}>
                    <div style={{ marginRight: '10px'}}>
                        <img src={item.images[0].url} width="50"/>
                    </div>
                    <div>
                        <p>{item.name} - {item.artists[0].name}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListItems;