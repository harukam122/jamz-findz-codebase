import request from 'browser-request';
import {Buffer} from 'buffer';


const requestTokenPromise = (options) => new Promise((resolve, reject) => {
    const client_id = "****************"
    const client_secret = "*******************"

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
      };
    request.post(authOptions, (error,response,body) => {
        if (error == null) {
            resolve(body.access_token);
        } else {
            reject(error);
        }
    });
});

const requestAPIPromise = (token) => new Promise((resolve, reject) => {
    const endpoint = "https://api.spotify.com/v1/browse/new-releases?" + new URLSearchParams({
            country: 'US',
            limit: 50
    })
    const options = {
        url: endpoint,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    };
    request.get(options, (error,response,body) => {
        if (error == null) {
            resolve(body);
        } else {
            reject(error);
        }
    });
})

 
export const getData = async() => {
    let token = await requestTokenPromise();
    let body = await requestAPIPromise(token);
    let bJson = await JSON.parse(body);
    return bJson.albums.items;
}



