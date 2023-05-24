var services = [
{
"name": "map service",
"ref": "urn:x-esri:serviceType:ArcGIS#TiledMapLayer",
"_class": "esri",
"_method": "tiledMapLayer"
},
{
"name": "mapserver",
"ref": "urn:x-esri:serviceType:ArcGIS#DynamicMapLayer",
"_class": "esri",
"_method": "dynamicMapLayer"
},
{
"name": "imageserver",
"ref": "urn:x-esri:serviceType:ArcGIS#ImageMapLayer",
"_class": "esri",
"_method": "imageMapLayer"
},
{
"name": "tms",
"ref": "https://www.ogc.org/standards/wmts",
"_class": "tileLayer",
"_method": ""
},
{
"name": "iiif",
"ref": "http://iiif.io/api/image",
"_class": "tileLayer",
"_method": "iiif"
},
{
"name": "image",
"ref": "https://schema.org/ImageObject",
"_class": "distortableImageOverlay",
"_method": ""
},
{
"name": "vectortile",
"ref": "https://openmaptiles.org/schema/",
"_class": "esri",
"_method": "Vector.vectorTileLayer"
},
{
"name": "feature layer",
"ref": "urn:x-esri:serviceType:ArcGIS#FeatureLayer",
"_class": "esri",
"_method": "featureLayer"
},
{
"name": "GeoJSON",
"ref": "https://datatracker.ietf.org/doc/html/rfc7946",
"_class": "geoJson",
"_method": "ajax",
"pattern":["GeoJSON"]
},
{
"name": "GeoJSON_CORS",
"ref": null,
"_class": null,
"_method": null
}
]