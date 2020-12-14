import React, { useState } from "react";
import PropTypes from 'prop-types';

const DefaultDelayTime = 1000;

const SearchBar = ({ searchChangeEvent, delaySearch = DefaultDelayTime }) => {
    const [timeoutId, setTimeoutId] = useState(null);
    const OnChangeEvent = (e) => {
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => {
            searchChangeEvent(e.target.value);
        }, delaySearch));
    }

    return (
        <div>
            <span>Searh repository keyword: </span>
            <span>
                <input type="text" onChange={OnChangeEvent} />
            </span>
        </div>
    );
}

SearchBar.propTypes = {
    searchChangeEvent: PropTypes.func,
    delaySearch: PropTypes.number
}


export default SearchBar;