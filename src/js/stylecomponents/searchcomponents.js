import styled from "styled-components";



export const RepoBlock = styled.li`
    padding-top: 24px;
    padding-bottom: 24px;
    border-top: 1px solid #e1e4e8;
    width: 80%;
`;

export const RepoTitle = styled.div`
    font-weight: 400;
    font-size: 16px;
`;
export const RepoDescription = styled.p`
    font-size: 12px;
`;
export const RepoInfo = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
`;
export const RepoInfoItem = styled.div`
    margin-right: 16px;
`;
export const RepoLanguageDot = styled.span`
    background-color: #f1e05a;
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid rgb(225, 212, 113);
    border-radius: 50%;
`;
export const RepoLanguage = styled.span`
    font-size: 12px;
    color: #586069;
`;


export const RepoDiv = styled.div`
    margin: 0px auto;
    width: 35%;
`;