import axios from 'axios';

const api = axios.create({
    baseURL: 'http://devshark.herokuapp.com'
})

export default api;