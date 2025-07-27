type GeoJSONType = 'Point' | 'Polygon' | 'Multipoint'

export interface Toilet {
    name: string,
    location: {
        type: GeoJSONType 
        coordinates: [number, number]
    }
}

