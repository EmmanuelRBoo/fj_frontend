import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { createControlComponent } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet-routing-machine'
import { ILocation } from '../interfaces/map'
import carIcon from '../assets/myPositionIcon.png'

export function Maps({ waypointLocations }: { waypointLocations: ILocation[] }) {
    const [myPosition, setMyPosition] = useState<ILocation | null>(null)

    const createRouteLayer = () => {

        const data: L.LatLng[] = []

        if (Array.isArray(waypointLocations)) {
            data.push(L.latLng(myPosition || { lat: 0, lng: 0 }))
            waypointLocations.forEach((coord) => {
                data.push(L.latLng(coord))
            })
            data.push(L.latLng(myPosition || { lat: 0, lng: 0 }))
        }

        const instance = L.Routing.control({
            waypoints: data,
            autoRoute: true,
        })

        return instance
    }

    const RoutingMachine = createControlComponent(createRouteLayer)

    const success = ({ coords }: { coords: any }) => {
        setMyPosition({
            lat: coords.latitude,
            lng: coords.longitude
        })
    }

    const myPositionIcon = new L.Icon({ iconUrl: carIcon, className: 'my-position-icon' })

    const error = () => {
        alert('erro ao encontrar localização')
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success, error)
    }, [])

    if (!myPosition) {
        return (
            <div className='map-loading-container'>
                <h2>Carregando Mapa...</h2>
            </div>
        )
    }

    return (
        <MapContainer
            center={myPosition}
            zoom={14}
            scrollWheelZoom={false}
            className='map-container'
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingMachine />

            <Marker
                position={myPosition}
                icon={myPositionIcon}
            />
        </MapContainer>
    )
}