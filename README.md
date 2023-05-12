# data_dictionary_automation
This project harvests open government data so it can be analysed for gaps. 

The focus of this research project is on sustainability, 
and determining what open data exists (and does not exist) will help in identifying opportunities 
for further open data sharing to support transdisciplinary sustainability research pursuits.

Two counties in were targeted for this project (Larimer and Weld), to provide coverage across Northern Colorado.
Data shared at the State, County, and City level were harvested with scripts (where possible) 
to generate a common structure to work with. Special attention was placed on accessing the data column names 
and type to support joining of datasets. Currently, the supported data harvesting API's are:
* Socrata - using dcat_data_inventory.py
* DCAT - using dcat_data_inventory.py

While effort has been placed on automating workflows, 
there is still a need for manual entry and quality control of the data harvested.

In cases where data cannot be readily accessed via APIs, these records have been manually entered as well.


The spreadsheet where all the data resides was originally created in Microsoft Excel, 
with the online version helping with collaboration. As the spreadsheet grew larger, 
it was moved to Google Drive which made it easier to work with and allowed publishing a single worksheet (e.g 
https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8j9KmPpm_fwMVy8bIdSowQx40EP1cqvkG4JZEsvTSYXMYVmv73p_RHirS1gttOA/pub?gid=1308010111&single=true&output=tsv)
for use in analysing the data.

A web interface has been assembled to peruse the data by porting over code from https://github.com/dcarver1/cwrUSA_maps, 
which gave a good base for pulling in tabular data and allowing interactive analysis for identifying patterns 
of data available in the catalog and posing the question of "What's missing?".

