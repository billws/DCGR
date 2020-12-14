import React from "react";
import PropTypes from 'prop-types';
import { DetectPosition } from "../pages/searchgitrepo";

class SearchBottom extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isTouch: false, timeOutId: null };
        this.selfRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
    }

    handleScroll() {
        if (this.state.timeOutId !== null || this.selfRef.current === null) {
            return;
        }
        this.setState({
            ...this.state, timeOutId: setTimeout(() => {
                if (DetectPosition(this.selfRef.current.getBoundingClientRect(), window)) {
                    this.setState({ isTouch: true, timeOutId: null });
                    if (typeof this.props.toEnd === "function") {
                        this.props.toEnd();
                    }
                } else {
                    this.setState({ isTouch: false, timeOutId: null });
                }
            }, 500)
        });
    }

    render() {
        return <div ref={this.selfRef} />;
    }
}

const SearchItem = ({ id, title, url }) => {
    return (<li key={id}>
        <div>
            {title}
        </div>
        <div>
            <a href={url}>Link</a>
        </div>
    </li>);
}

SearchItem.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    url: PropTypes.string
}


const SearchResult = ({ children, isLoading, changePage, isFetchAll }) => {
    return (
        <ul>
            { children}
            { isLoading ? <div>Loading...</div> : <SearchBottom toEnd={changePage} />}
        </ul>
    );
}

SearchResult.propTypes = {
    searchResult: PropTypes.array,
    isLoading: PropTypes.bool,
    changePage: PropTypes.func,
    isFetchAll: PropTypes.bool
};

export { SearchResult, SearchItem };