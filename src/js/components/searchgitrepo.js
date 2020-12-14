import React, { useState, useEffect, useReducer } from "react";
import SearchBar from "./searchbar";
import { SearchResult, SearchItem } from "./searchresult";

import { GetSearchUrl, UpdateSearchUrl, DefaultPage, DefaultPerPage, FetchGitRepo } from "../pages/searchgitrepo";

const SearchGitRepos = () => {
    const [searchUrl, setNewSearchUrl] = useState({ keyWord: null, page: DefaultPage, isFetchAll: false });
    const [searchResult, setNewSearchResult] = useState({ result: [], total: 0, isLoad: false });
    const changeNewSearchUrl = (keyWord) => {
        setNewSearchUrl({ ...searchUrl, keyWord, page: DefaultPage, isFetchAll: false });
    }

    const scrollPage = () => {
        let totalPage = Math.ceil(searchResult.total / DefaultPerPage);
        if ((searchUrl.page + 1) <= totalPage) {
            setNewSearchUrl({ ...searchUrl, page: ++searchUrl.page });
        } else {
            setNewSearchUrl({ ...searchUrl, isFetchAll: true });
        }
    }

    useEffect(() => {
        if (searchUrl.keyWord === null) {
            setNewSearchResult({ result: [], total: 0, page: DefaultPage, isLoad: false });
            return () => {
            };
        }
        setNewSearchResult({ result: [], total: 0, page: DefaultPage, isLoad: true });
        FetchGitRepo({ url: GetSearchUrl({ keyWord: searchUrl.keyWord }) }).then(responseData => {
            setNewSearchResult({ result: responseData.items, total: responseData.total_count, page: DefaultPage, isLoad: false });
        });
    }, [searchUrl.keyWord]);

    useEffect(() => {
        if (searchUrl.page < 1) {
            return () => {
            };
        }
        setNewSearchResult({ ...searchResult, isLoad: true });
        FetchGitRepo({ url: UpdateSearchUrl({ url: GetSearchUrl({ keyWord: searchUrl.keyWord }), page: searchUrl.page }) }).then(responseData => {
            setNewSearchResult({ ...searchResult, result: searchResult.result.concat(responseData.items), isLoad: false });
        });
    }, [searchUrl.page]);

    return (
        <div>
            <SearchBar searchChangeEvent={changeNewSearchUrl} />
            <SearchResult isLoading={searchResult.isLoad} changePage={scrollPage}>
                {(searchResult.result.length > 0) ?
                    searchResult.result.map(x => <SearchItem key={x.id} id={x.id} title={x.full_name} url={x.html_url} />) :
                    searchResult.isLoad || <div>No Search Result.</div>}
                {!searchUrl.isFetchAll || <div>Fetch All</div>}
            </SearchResult>
        </div>
    );
}

export default SearchGitRepos;