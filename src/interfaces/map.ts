import { IEndereco } from './clientes'

export interface IMap {
    waypoints: Array<IEndereco>
}

export interface ILocation {
    lat: number,
    lng: number
}