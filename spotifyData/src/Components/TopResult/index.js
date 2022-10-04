const TopResult = (props) => {
    if(props.topResult.length == 0 ) return
    console.log(props)
    const handleTopResultClick = () => {
        props.handleSearchResultClick(props.topResult[0]);
    }

    return(
        <div style={{width: 450+'px'}} onClick={handleTopResultClick}>
            <div className='result-title'>
                <p>Top Result:</p>
            </div>
            <div>
                <p>{props.topResult[0].name}</p>
                <p>{props.topResult[0].followers}</p>
                <img width={250} src={props.topResult[0].image} />
            </div>
        </div>
    )
}

export default TopResult