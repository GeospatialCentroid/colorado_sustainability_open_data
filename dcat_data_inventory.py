# The following takes a DCAT endpoint and pulls all the items and their metadata
# a csv file is generated populated with information for later use
# the output csv file


# Steps to use:
# call the socrata_data_inventory.py passing the following arguments
# -end_point_url: the url to the collection collection name
# -output: the name of the output file

# Here's what was run
# python dcat_data_inventory.py -end_point_url "https://greeleygis2017-02-01t212304815z-greeley.opendata.arcgis.com/data.json" -output "dcat_output.csv" -org_name greeley
#python dcat_data_inventory.py -end_point_url "https://townof-johnstown.hub.arcgis.com/data.json" -output "dcat_output.csv" -org_name johnstown
#python dcat_data_inventory.py -end_point_url "https://gisdata-estespark.hub.arcgis.com/data.json" -output "dcat_output.csv" -org_name estes
#python dcat_data_inventory.py -end_point_url "https://gishub.weldgov.com/data.json" -output "dcat_output.csv" -org_name weld
#python dcat_data_inventory.py -end_point_url "https://town-of-erie-co-new-site-erieco.hub.arcgis.com/data.json" -output "dcat_output.csv" -org_name north_glen
#python dcat_data_inventory.py -end_point_url "https://evanscolorado-evans.opendata.arcgis.com/data.json" -output "dcat_output.csv" -org_name evans

import argparse
import csv

from FileCollection import FileCollection
import os.path
from os import path
import json

parser = argparse.ArgumentParser()
parser.add_argument("-end_point_url", help="")
parser.add_argument("-output", help="")
parser.add_argument("-org_name", help="")
parser.add_argument("-item_ids", help="")
parser.add_argument("-overwrite", help="")

args = parser.parse_args()


class SocrataHarvester:
    def __init__(self, props):
        # transfer props into object
        for p in props:
            setattr(self, p, props[p])

        self.features = []

    def load(self, props):
        # start by creating a folder to store the data we are harvesting
        if not path.exists(self.path):
            os.mkdir(self.path)
        # create the storage folder if it doesn't exists
        if not path.exists(self.path + self.data_folder):
            os.mkdir(self.path + self.data_folder)

        file_collection = FileCollection(props)

    def wrap_it_up(self, output_data):
        # since data maybe loaded from webservices we need to wait till these are complete

        f = open(self.output, 'w')

        wr = csv.writer(f, quoting=csv.QUOTE_ALL)
        # use lists to transfer the data into a csv file
        temp_list = []
        # create header row
        for i in crosswalk:
            temp_list.append(i)
        wr.writerow(temp_list)

        # now populate the dataset records
        for r in output_data:
            temp_list = []
            for o in r:
                if isinstance(r[o], list):
                    r[o] = ",".join(r[o])
                temp_list.append(r[o])
            # print(temp_list)
            wr.writerow(temp_list)

        f.close()


harvest_props = {
    "path":"data/",
    "data_folder":"harvested",
    "output":args.output
}

harvester = SocrataHarvester(harvest_props)

## crosswalk for what goes
## crosswalk for what goes where using special handeling for:
# injection (i.e. {id})
# unordered lists requiring match and extraction of a specific key - append '__array' to list and 'format=' for item to match

crosswalk={
"Title":"title",
"Description":"description",
"Organization":"publisher,name",
"Webpage":"distribution__array,format=Web Page,accessURL",
"Download link":"distribution__array,format=GeoJSON,accessURL",
"Web service":"distribution__array,format=ArcGIS GeoServices REST API,accessURL",
"Local file name":"",
"Metadata link":"",
"Login required (y/n)":"",
"Spatial Coverage":"",
"Smallest Geographic Boundary Available":"",
"Keywords":"keyword",
"Topic":"",
"column name":"",
"column field name":"",
"column type":"",
"column description":"",
"No. Records":"",
"Resource Type":"",
"Format":"",
"Date Accessed":"",
"Date coverage":"",
"Contact Name":"contactPoint,fn",
"Contact Phone":"",
"Contact Email":"contactPoint,hasEmail",
"Notes":"",
"Extent":"spatial"
}


load_props = {
    "end_point_url":args.end_point_url,
    'results':'dataset',# the array in the json with all the datasets
    'crosswalk':crosswalk,
    'output_data':[],
    "org_name": args.org_name,
    "path":harvest_props["path"]+harvest_props["data_folder"]+"/",
    "resource_ids":args.item_ids,
    "overwrite":args.overwrite,
    "harvester":harvester
}
harvester.load(load_props)
