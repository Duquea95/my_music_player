const TopResult = ({topResult}) => {
    
    const createTopResult = () => {
        if(topResult.length == 0 ) return
        
        return(
            <div>
                <p>{topResult[0].name}</p>
                <p>{topResult[0].followers}</p>
                <img width={250} src={topResult[0].image} />
            </div>
        )
    }

    return(
        <div style={{width: 400+'px'}}>
            <div className='result-title'>
                <p>Top Result:</p>
            </div>
            {createTopResult()}
        </div>
    )
}

export default TopResult