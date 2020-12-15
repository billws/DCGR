import PropTypes from 'prop-types';
const GitHubDomain = "https://api.github.com";
const RepoSearchPath = "/search/repositories";
const UrlQueryPara = "q";
const UrlQueryPage = "page";
const UrlQueryPerPage = "per_page";
const UrlQuerySort = "sort";
const UrlQueryOrder = "order";
const RequestRateLimit = 10;
const RequestRateLimitTime = 120000;

export const DefaultPage = 1;
export const DefaultPerPage = 30;
export const AcceptContent = "application/vnd.github.v3+json";
export const DefaultSort = "stars";
export const DefaultOrder = "desc";
export const OverRateLimitMessage = "For unauthenticated requests, the rate limit allows you to make up to 10 requests per minute.";

const DetectPosition = (node, win) => {
    if (!node || !win) {
        return false;
    }
    let top = node.top;
    let height = node.height;
    let innerHeight = win.innerHeight;

    if (0 <= (top + height) && top <= (innerHeight)) {
        return true;
    }
    return false;
}

DetectPosition.propTypes = {
    node: PropTypes.object,
    win: PropTypes.object
};



const IsOverRateLimit = (count, lastDate) => {
    if (!lastDate) {
        return { notOver: false, reset: false };
    }
    let now = new Date();
    if ((now.getTime() - lastDate.getTime()) > RequestRateLimitTime) {
        return { notOver: true, reset: true };
    }
    else {
        if (count + 1 > RequestRateLimit) {
            return { notOver: false, reset: false };
        } else {
            return { notOver: true, reset: false };
        }
    }
}

IsOverRateLimit.propTypes = {
    count: PropTypes.number,
    lastDate: PropTypes.PropTypes.instanceOf(Date)
}

const GetSearchUrl = ({ keyWord, perPage = DefaultPerPage }) => {
    if (!keyWord) {
        return null;
    }
    return (`${GitHubDomain}${RepoSearchPath}?` +
        `${UrlQueryPara}=${encodeURIComponent(keyWord)}&` +
        `${UrlQuerySort}=${DefaultSort}&` +
        `${UrlQueryOrder}=${DefaultOrder}&` +
        `${UrlQueryPerPage}=${perPage}`);
}

GetSearchUrl.propTypes = {
    keyWord: PropTypes.string,
    perPage: PropTypes.number
};


const UpdateSearchUrl = ({ url, page = DefaultPage }) => {
    if (!url) {
        return null;
    }
    if (page < 0) {
        return url;
    }
    return `${url}&${UrlQueryPage}=${page}`;
}

UpdateSearchUrl.propTypes = {
    url: PropTypes.string,
    page: PropTypes.number
};

const FetchGitRepo = ({ url, keyWord }) => {
    if (url) {
        return fetch(url, { headers: { 'Accept': AcceptContent } }).then(response => response.json());
    } else {
        if (keyWord !== "" && keyWord !== null && keyWord !== undefined) {
            return fetch(GetSearchUrl(keyWord), { headers: { 'Accept': AcceptContent } }).then(response => response.json());
        } else {
            return new Promise((resolve) => {
                resolve({
                    total_count: 0,
                    items: []
                });
            });
        }

    }
}


FetchGitRepo.propTypes = {
    url: PropTypes.string,
    keyWord: PropTypes.string
};


export { GetSearchUrl, UpdateSearchUrl, FetchGitRepo, DetectPosition, IsOverRateLimit };