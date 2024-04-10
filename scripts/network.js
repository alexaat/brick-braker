import { endpoint } from "./constants.js"
import { setDataLoading } from "./model.js";

export const fetchRank = (score, time) => {
    const url = endpoint + '/rank?' + new URLSearchParams({ score, time });
    return fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    });
}

export const fetchScores = (page) => {
    setDataLoading(true);
    let url = endpoint + '/score/' + page;
    return fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
}

export const uploadScore = (name, score, time) => {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const url = endpoint + '/score';
    return fetch(url, {
        method: "POST",
        headers,
        body: new URLSearchParams({
            name, score, time
        })
    })
}
