import React from "react";
import PropTypes from 'prop-types';
import { RepoBlock, RepoTitle, RepoDescription, RepoInfo, RepoInfoItem, RepoLanguageDot, RepoLanguage } from "../stylecomponents/searchcomponents";
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
                if (this.selfRef.current !== null && DetectPosition(this.selfRef.current.getBoundingClientRect(), window)) {
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

SearchBottom.propTypes = {
    toEnd: PropTypes.func
}


const SearchItem = ({ id, title, url, description, language, updateAt }) => {
    return (<RepoBlock key={id}>
        <RepoTitle>
            <a href={url}>{title}</a>
        </RepoTitle>
        <RepoDescription>
            {description}
        </RepoDescription>
        <RepoInfo>
            {language ?
                <RepoInfoItem>
                    <RepoLanguageDot />
                    <RepoLanguage>{language}</RepoLanguage>
                </RepoInfoItem>
                : <></>}
            {updateAt ?
                <RepoInfoItem>
                    <RepoLanguage>
                        {updateAt.split("T")[0]}
                    </RepoLanguage>
                </RepoInfoItem>
                : <></>}
        </RepoInfo>
    </RepoBlock>);
}

SearchItem.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
    language: PropTypes.string,
    updateAt: PropTypes.string
}


const SearchResult = ({ children }) => {
    return (
        <ul>
            {children}
        </ul>
    );
}

SearchResult.propTypes = {
    children: PropTypes.node,
};

export { SearchResult, SearchItem, SearchBottom };