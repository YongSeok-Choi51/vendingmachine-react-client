import axios from 'axios';
import process from 'process';


export const RestApiClient = axios.create({
    // baseURL: process.env.BASE_URL,
    baseURL: "http://localhost:3000"
});

