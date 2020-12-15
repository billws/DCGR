import React, { useState, useEffect } from "react";
import SearchBar from "./searchbar";
import { SearchResult, SearchItem, SearchBottom } from "./searchresult";
import { RepoDiv } from "../stylecomponents/searchcomponents";
import { GetSearchUrl, UpdateSearchUrl, DefaultPage, DefaultPerPage, FetchGitRepo, IsOverRateLimit, OverRateLimitMessage } from "../pages/searchgitrepo";


const SearchGitRepos = () => {
    const [searchUrl, setNewSearchUrl] = useState({ keyWord: null, page: DefaultPage, isFetchAll: false, fetchDate: new Date(), fetchCount: 0 });
    const [searchResult, setNewSearchResult] = useState({ result: [], total: 0, isLoad: false });

    const changeNewSearchUrl = (keyWord) => {
        let rateLimit = IsOverRateLimit(searchUrl.fetchCount, searchUrl.fetchDate);
        if (rateLimit.notOver) {
            let newSearchUrl = { ...searchUrl, keyWord, page: DefaultPage, isFetchAll: false, fetchCount: ++searchUrl.fetchCount };
            if (rateLimit.reset) {
                newSearchUrl.fetchDate = new Date();
                newSearchUrl.fetchCount = 0;
            }
            setNewSearchUrl(newSearchUrl);
        } else {
            alert(OverRateLimitMessage);
        }
    }
    const scrollPage = () => {
        let totalPage = Math.ceil(searchResult.total / DefaultPerPage);
        if ((searchUrl.page + 1) <= totalPage) {
            let rateLimit = IsOverRateLimit(searchUrl.fetchCount, searchUrl.fetchDate);
            if (rateLimit.notOver) {
                let newSearchUrl = { ...searchUrl, page: ++searchUrl.page, fetchCount: ++searchUrl.fetchCount };
                if (rateLimit.reset) {
                    newSearchUrl.fetchDate = new Date();
                    newSearchUrl.fetchCount = 0;
                }
                setNewSearchUrl(newSearchUrl);
            } else {
                alert(OverRateLimitMessage);
            }
        } else {
            setNewSearchUrl({ ...searchUrl, isFetchAll: true });
        }
    }

    useEffect(() => {
        if (searchUrl.keyWord === null) {
            setNewSearchResult({ result: [], total: 0, isLoad: false });
            return () => {
            };
        }
        setNewSearchResult({ result: [], total: 0, isLoad: true });
        FetchGitRepo({ url: GetSearchUrl({ keyWord: searchUrl.keyWord }) }).then(responseData => {
            setNewSearchResult({ result: responseData.items, total: responseData.total_count, isLoad: false });
        }, () => {
            setNewSearchResult({ ...searchResult });
        });
    }, [searchUrl.keyWord]);

    useEffect(() => {
        if (searchUrl.page < 2) {
            return () => {
            };
        }
        setNewSearchResult({ ...searchResult, isLoad: true });
        FetchGitRepo({ url: UpdateSearchUrl({ url: GetSearchUrl({ keyWord: searchUrl.keyWord }), page: searchUrl.page }) }).then(responseData => {
            setNewSearchResult({ ...searchResult, result: searchResult.result.concat(responseData.items), isLoad: false });
        }, () => {
            setNewSearchResult({ ...searchResult });
        });
    }, [searchUrl.page]);

    return (
        <RepoDiv>
            <SearchBar searchChangeEvent={changeNewSearchUrl} />
            <div>{searchResult.total} repository results</div>
            <SearchResult>
                {(searchResult.result.length > 0) ?
                    searchResult.result.map(x =>
                        <SearchItem
                            key={x.id}
                            id={x.id}
                            title={x.full_name}
                            url={x.html_url}
                            description={x.description}
                            language={x.language}
                            updateAt={x.updated_at} />) :
                    <></>}
            </SearchResult>
            { searchUrl.isFetchAll ? <div>Fetch All</div> : <></>}
            { searchResult.isLoad ? <div>Loading...</div> : <SearchBottom toEnd={scrollPage} />}
        </RepoDiv>
    );
}

export default SearchGitRepos;