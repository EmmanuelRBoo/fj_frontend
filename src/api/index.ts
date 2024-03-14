import axios, { CreateAxiosDefaults } from 'axios'

const config: CreateAxiosDefaults = {
    baseURL: 'https://fj-backend.onrender.com/api/v1',
}

const googleConfig: CreateAxiosDefaults = {
    baseURL: 'https://places.googleapis.com',
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyBHzYQbQF3s5SERajTOV5azWLPjbrcWsa8'
    }
}

const coordsConfig: CreateAxiosDefaults = {
    baseURL: 'https://geocode.maps.co/search'
}

export const api = axios.create(config)

export const googleApi = axios.create(googleConfig)

export const coordsApi = axios.create(coordsConfig)
