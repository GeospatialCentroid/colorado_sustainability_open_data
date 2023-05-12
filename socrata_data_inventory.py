# The following takes a scorata endpoint and pulls all the items and their metadata
# a csv file is generated populated with information for later use
# the output csv file


# Steps to use:
# call the socrata_data_inventory.py passing the following arguments
# -end_point_url: the url to the collection collection name
# -output: the name of the output file

# Here;s what was run
# python socrata_data_inventory.py -end_point_url "https://api.us.socrata.com/api/catalog/v1?domains=data.colorado.gov&only=dataset&limit=3000" -output "datasets_output.csv" -org_name Colorado
# python socrata_data_inventory.py -end_point_url "https://api.us.socrata.com/api/catalog/v1?domains=data.colorado.gov&only=map&limit=3000" -output "map_output.csv" -org_name Colorado
# -overwrite=1

#python socrata_data_inventory.py -end_point_url "https://api.us.socrata.com/api/catalog/v1?domains=opendata.fcgov.com&only=dataset&limit=3000" -output "fc_datasets_output.csv" -org_name "Fort Collins" -overwrite=1
#python socrata_data_inventory.py -end_point_url "https://api.us.socrata.com/api/catalog/v1?domains=opendata.fcgov.com&only=map&limit=3000" -output "fc_map_output.csv" -org_name "Fort Collins" -overwrite=1


# https://api.us.socrata.com/api/catalog/v1?domains=opendata.fcgov.com&limit=3000

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

        f = open(self.output, 'w')

        wr = csv.writer(f, quoting=csv.QUOTE_ALL)
        # use lists to transfer the data into a csv file
        temp_list=[]
        # create header row
        for i in crosswalk:
            temp_list.append(i)
        wr.writerow(temp_list)

        # now populate the dataset records

        print(len(output_data))
        for r in output_data:
            temp_list = []
            for o in r:
                if isinstance(r[o], list):
                    r[o] = ",".join(r[o])
                temp_list.append(r[o])
            #print(temp_list)
            wr.writerow(temp_list)

        f.close()


harvest_props = {
    "path":"data/",
    "data_folder":"harvested",
    "output":args.output
}

harvester = SocrataHarvester(harvest_props)

## crosswalk for what goes where using special handeling for:
# injection (i.e. {id})
# unordered lists requiring match and extraction of a specific key - append '__array' to list and 'key=' for item to match

crosswalk={
"Title":"resource,name",
"Description":"resource,description",
"Organization":"resource,attribution",
"Webpage":"permalink",
#"Download link":"https://data.colorado.gov/api/views/{id}/rows.csv?accessType=DOWNLOAD",
#"Download link":"https://data.colorado.gov/api/geospatial/{id}?method=export&format=GeoJSON", # for map data

"Download link":"https://opendata.fcgov.com/api/views/{id}/rows.csv?accessType=DOWNLOAD",
#"Download link":"https://opendata.fcgov.com/api/geospatial/{id}?method=export&format=GeoJSON", # for map data

#"Web service":"https://data.colorado.gov/resource/{id}.json",
"Web service":"https://opendata.fcgov.com/resource/{id}.json",
"Local file name":"",
"Metadata link":"classification,domain_metadata__array,key=Additional-Dataset-Documentation_Additional-Metadata,value",
"Login required (y/n)":"",
"Spatial Coverage":"classification,domain_metadata__array,key=Dataset-Coverage_Geographic-Coverage,value",
"Smallest Geographic Boundary Available":"",
"Keywords":"classification,domain_tags",
"Topic":"classification,categories",
"column name":"resource,columns_name",
"column field name":"resource,columns_field_name",
"column type":"resource,columns_datatype",
"column description":"resource,columns_description",
"No. Records":"classification,domain_metadata__array,key=Data-Updates_Total-Records-At-Initial-Publish,value",
"Resource Type":"classification,domain_metadata__array,key=Dataset-Coverage_Unit-of-Analysis,value",
"Format":"",
"Date Accessed":"",
"Date coverage":"",
"Contact Name":"classification,domain_metadata__array,key=Contributing-Agency-Information_Business-Contact-and-Phone,value",
"Contact Phone":"",
"Contact Email":"",
"Notes":"classification,domain_metadata__array,key=Data-Description_Related-Datasets,value"
}


load_props = {
    "end_point_url":args.end_point_url,
    'results':'results',# the array in the json with all the datasets
    'crosswalk':crosswalk,
    'output_data':[],
    "org_name": args.org_name,
    "path":harvest_props["path"]+harvest_props["data_folder"]+"/",
    "resource_ids":args.item_ids,
    "overwrite":args.overwrite,
    "harvester":harvester
}
harvester.load(load_props)
