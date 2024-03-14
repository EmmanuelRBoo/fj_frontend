import { googleApi, coordsApi } from './index'

export const searchLocation = async (input: string) => {
    return await googleApi.post('/v1/places:autocomplete', { input })
}

export const getCoords = async (input: string) => {
    return await coordsApi.post(`?q="${input}"&api_key=65f255f67ed00203849141lrqbc60f9`)
}