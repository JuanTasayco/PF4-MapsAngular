export interface PlacesResponse {
    attribution: string;
    features: Feature[];
    query: string[];
    type: string;
}

export interface Feature {
    bbox?: number[];
    center: number[];
    context: Context[];
    geometry: Geometry;
    id: string;
    language?: string;
    language_es?: string;
    matching_place_name?: string;
    matching_text?: string;
    place_name: string;
    place_name_es: string;
    place_type: string[];
    properties: Properties;
    relevance: number;
    text: string;
    text_es: string;
    type: string;
}

export interface Context {
    id: string;
    language?: string;
    language_es?: string;
    short_code?: string;
    text: string;
    text_es: string;
    wikidata?: string;
}

export interface Geometry {
    coordinates: number[];
    type: string;
}

export interface Properties {
    accuracy?: string;
    "override:postcode"?: string;
    wikidata?: string;
}
