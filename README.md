# Colorado Sustainability Open Data Catalog
This project was developed to facilitate transdisciplinary research by creating a comprehensive catalog of sustainability open data. With a focus on sustainability related data access, and a target region of Northern Colorado (encompassing Larimer and Weld County), the steps taken to achieve this goal are as follows:

1. Compile a list existing projects that have brought Northern Colorado open data together, and organize these datasets in a spreadsheet
2. Identify metadata elements needed for machine readability to support data discovery and exploration.
3. Perform a comprehensive search for data related to sustainability, branching from the initial list to identify additional sources of data.
4. Leverage automation where possible to gather metadata from datasets

The catalog created for this project exists as a shareable spreadsheet. Special attention has been placed on dataset interoperability and access. This has involved exposing details about datasets such as map bounds, dates covered, and data columns. Capturing web services and direct download links as part of the spreadsheet also enables researchers to explore data online and download data directly as needed.


## Data Harvesting

Efforts have been made to leverage APIs where possible to assist with automating the collection of metadata for use in the Northern Colorado Sustainability Catalog. Two common platforms and accompanying APIs were found to be in use by open data sharing organizations. These include Socrata and the Data Catalog Vocabulary (DCAT). To harvest from these platforms, the python scripting language was used. Though Python quite powerful we merely used it to:



* Access the API endpoint
* Gather all listed datasets
    * Where necessary, retrieve accompanying metadata files
* Extract relevant metadata elements and create a local copy of files retrieved.
* Export a CSV file to be appended to the catalog.


## Manual Data Entry

A tremendous amount of open data can be found from webpages that do not have an easy way to programmatically extract it. These data are quite diverse and range from web maps with controls that let you alter the view, data presented as just points on a graph with minimal descriptions, and web pages listing files for download. In these cases, data entry is heavily dependent on navigating the web page where the content resides to gather the necessary information.

	As it is our hope to support spatial search and the eventual joining of datasets, drilling down into the data and extracting structured dataset level column information is important. While extracting this information has largely been achieved through automation techniques run in batch, as new datasets are added to the collection manually, there was a need for tooling that  supported the extraction of this information. These tools and other helpful features have been built into a web portal to allow viewing and extracting this more granular metadata.


## Web Portal

To assist with curation and analysis of catalog, a web portal was created. This portal can be accessed at [https://geospatialcentroid.github.io/colorado_sustainability_open_data](https://geospatialcentroid.github.io/colorado_sustainability_open_data) and offers data administrators features beyond standard spreadsheet software to help improve dataset metadata and identify gaps in collected data.

The web portal also demonstrates how datasets from multiple sources can be brought together and visualized within a single interface. As dataset level metadata has been captured and exposed for machine-readability, the potential to see how disparate datasets could be joined by a common column is demonstrated.

The following is a list of uses of the web portal:


### Curation



* Identifying omissions in metadata
    * Broken links
    * Missing fields
* Generating boundary boxes
* Subsetting like datasets to test as a group


### Analysis



* Showing prevalence of terms
    * Including dataset level column names
* Filtering data
* Spatial search
* Data visualization
* Tabular data sorting


## How the web portal works

The web portal is a client-side application that allows visitors to interact with datasets loaded from a catalog. The catalog is stored as a Google Sheet, published to the web as a CSV file.

When the web portal loads, the catalog is loaded along with it. This catalog is converted to a JSON structure for ease of use, and then programmatically analyzed to populate the dynamic filtering system. The programmatic analysis inspects all columns of information and counts the prevalence of terms. These terms are used as facets allowing visitors to filter datasets by these terms.

Specific catalog columns can be identified for special treatment. Comma separated values, for instance, can be split allowing each of the separated values to be treated as individual terms. This has been used to separate dataset column names, types, aliases, and descriptions, which is useful in identifying datasets that share a common column which might later be used to join datasets.


#### User Experience

After the web-portal is loaded, visitors are able to interact with the catalog by either entering a text search, searching geospatially and temporally, or selecting one of the facets.

The filtered results are then displayed, allowing visitors to drill into the details.

When visitors mouse over a geospatial dataset in the results, the boundary box containing the data is displayed on the map providing a visual indication of the coverage area.

Both tabular and geospatial datasets can be loaded and interacted with from within the browser. Clicking the "Add button" will initiate the loading of the data for viewing.


## Features

The feature-rich web portal provides the following features:



* Search System
    * A dynamically driven search system generates facets on the fly by parsing through the catalog columns.
        * Datasets with multiple options in columns are parsed through to support keyword and dataset column level searching.
    * An anywhere search will return records matching searched text
    * Map boundary searching allows filtering of results to include only those that overlap with the map bounds
    * By combining the various search controls, complex searches can be performed.
* Data Visualization
    * Dataset web services are accessed from remote servers to display data from within the web portal.
    * Both spatial and tabular data are supported.
* Viewing multiple layers at the same time is supported for use in performing online comparisons.


## Benefits

There are many benefits to the approach taken in developing the web portal as a client-side application powered by a single spreadsheet. These benefits include:



* Responsiveness, as the entire data catalog is loaded along with the web-portal, with facets generated on-the-fly and stored in memory, all searches and filtering are quick.
* No need for specialized software on the server. The web-portal can be hosted for free using GitHub Pages. Web hosting normally incurs a monthly cost, which must be paid for to keep the website online.
* Additional information and updates to the catalog can be added easily by anyone familiar with spreadsheet software.


## Limitations

As the web portal is a dynamically driven web page running entirely on the client-side, there are several drawbacks to this approach as outlined below:



* Limited Google Search indexing.
* Limited dataset form validation. Beyond basic spreadsheet software validation catalogers could introduce errors into the spreadsheet which are immediately displayed on the website.
* As the catalog increases in size, the initial load and programmatic analysis could prevent slow computers from parsing through the data. A client-server architecture is commonly used to mitigate the need for visitors to have powerful computers.
* Large datasets loaded into the bowser can crash the application. While most datasets are small (&lt;4000 records), offering a means to inform visitors of the size of the data before they attempt to load it would be beneficial.


## Future Enhancements



* Parent child relationships
    * For data from the same source that would be best kept together (such as all the Colorado Parks and Wildlife Species data with over 300 datasets [[https://services5.arcgis.com/ttNGmDvKQA7oeDQ3/ArcGIS/rest/services/CPWSpeciesData/FeatureServer](https://services5.arcgis.com/ttNGmDvKQA7oeDQ3/ArcGIS/rest/services/CPWSpeciesData/FeatureServer)], the ability to group these data would better constrain the number of datasets listed while still providing end uses with access.
* Multilingual​ support
    * Text used in the web portal is stored in a translation file. To support another language, one simply needs to make a copy of this file, name it appropriately with the name of the language to support and replace the values to be translated.
* Joining datasets
    * With column level details for datasets exposed within the catalog, the identification of columns which could be joined, as well as, performing these joins could be supported.
* Download multiple dataset together
    * To help researches take their work onto their local computer for further analysis, enabling the ability to download multiple datasets from different sources with a single click could be supported


## Opportunities

There are many opportunities this project could support.



1. The spreadsheet used to catalog datasets offers the advantage of being both flexible and portable. Other groups looking to undertake similar efforts could take the structure established and begin adding datasets relevant to their community. If additional columns are required these can be easily added.
2. Datasets cataloged in the spreadsheet can be exported into standard metadata structures like [Ecological Metadata Language (EML)](https://eml.ecoinformatics.org/) and [OpenGeoMetadata](https://opengeometadata.org/). This exported metadata can then be shared through communities like [OpenGeoMetadata](https://github.com/OpenGeoMetadata) to improve dataset access.