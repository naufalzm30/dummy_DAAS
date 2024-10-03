import axios from 'axios'

const getAPI = axios.create({
    // baseURL: 'https://pdamsby.blitztechnology.tech/api/',
    // imageURL: 'https://pdamsby.blitztechnology.tech/',

    baseURL: process.env.VUE_APP_API_URL,
    imageURL: process.env.VUE_APP_IMAGE_API_URL,

})

export { getAPI }