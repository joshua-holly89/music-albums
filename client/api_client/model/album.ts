/**
 * Albums API
 * The albums API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Album { 
    id: number;
    artist_name: string;
    album_title: string;
    release_date: string;
    genre: string;
    record_label: string;
    cover_base64: string;
    rating: number;
    number_of_ratings: number;
}
