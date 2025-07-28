type GeoJSONType = 'Point' | 'Polygon' | 'Multipoint'

export interface ToiletLocation {
    type: GeoJSONType,
    coordinates: [number, number]
}

export interface Toilet {
    name: string,
    location: ToiletLocation
}

export interface ToiletsNearby {
    location: {
        $geoWithin: {
            $box: [
                [number, number],
                [number, number]
            ] 
        }
    }
}

