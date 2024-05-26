import axios from 'axios'

const getAPI = axios.create({
    // baseURL: 'http://127.0.0.1:8000',
    // baseURL: 'https://weatherapi.blitztechnology.tech',
    baseURL: 'http://pdamsby.blitztechnology.tech/api/',

    // timeout: 7000,
})

export { getAPI }