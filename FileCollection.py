"""
The super class FileCollection is used to handle json file loading/saving and database ingestion through Change Management System

"""

import urllib.request, json
import ssl
import os.path
from os import path
import time

from datetime import datetime

class FileCollection:
    '''
    Control the REST requests and the passed params
    '''
    def __init__(self,props):
        # take the end point and start loading the data
        for p in props:
            setattr(self, p, props[p])

        self.start=1
        self.page = 1
        self.total=None
        self.folder = self.org_name
        self.loaded_resource_ids = []
        self.complete_resource_ids = []

        if not path.exists(self.path+self.folder):
            os.mkdir(self.path+self.folder)

        self.load_results()

    def load_results(self):
        # declare the folder and file names
        folder_path=self.path+self.folder+"/"
        file=self.org_name+".json"
        _file = folder_path + file
        #check if the data exists
        url = self.end_point_url
        self.load_file_call_func( _file, url,'check_loaded')



    def check_loaded(self,data, parent_obj=False):
        """

        :param data:
        :param parent_obj:
        :return:
        """
        # scan the json looking for how many records have been downloaded
        # can setup the next request if there are more pages to be downloaded

        self.drill_loaded_data(data)

    def drill_loaded_data(self, data):
        """

        :param data:
        :return:
        """
        # start by making sure a 'layers' folder exists
        layers_path = self.path + self.folder + "/layers"
        if not path.exists(layers_path):
            os.mkdir(layers_path)



        for index, r in enumerate(data[self.results]):
            # todo  - remove when done testing
            # if index >1:
            #     break

            if 'resource' in r:
                id = r['resource']['id']
            else:
                # for esri
                id = r['identifier']
                if 'id=' in id:
                    id = id[id.index('id=')+3:]
                    if "&" in id:
                        id = id[:id.rindex('&')]

            self.loaded_resource_ids.append(id)

            if self.resource_ids:
                # only load specified resource ids
                for r_id in self.resource_ids:
                    if r_id == id:
                        self.load_data(id, r, layers_path)

            else:
                self.load_data(id, r, layers_path)

        if len(self.complete_resource_ids) == len(self.loaded_resource_ids):
            self.harvester.wrap_it_up(self.output_data)

    def load_file_call_func(self, _file, _url, _func, parent_obj=False):
        """

        :param _file: the name (w/ path) of the file to save
        :param _url: the absolute URL to the json
        :param _func: The function to call upon completion
        :param parent_obj: extra info to retain when loading
        :return: None
        """

        if not path.exists(_file) or self.overwrite:
            # setup the url to load each request
            print("loading file", _url)
            if _url.startswith("//"):
                _url="https:"+_url
            urllib.request.urlretrieve(_url, _file)
            try:
                context = ssl._create_unverified_context()
                response = urllib.request.urlopen(_url, context=context)
                with open(_file, 'w', encoding='utf-8') as outfile:
                    try:
                        outfile.write(json.dumps(json.loads(response.read().decode('utf-8')), indent=4, sort_keys=True))
                    except:
                        outfile.write(response.read().decode('utf-8'))
                self.load_file(_file, _func, parent_obj)

            except ssl.CertificateError as e:
                print("Data portal URL does not exist: " + _url)

        else:
            # load the file

            self.load_file(_file,_func, parent_obj)

    def load_data(self,id,r,layers_path):
        """
        :param id:
        :param r:
        :param layers_path:
        :return:
        """
        # flag for extra file to download
        _file =False
        _url=False
        output_record=self.crosswalk.copy()
        self.output_data.append(output_record)
        for c in self.crosswalk:
            val=self.crosswalk[c]
            # set the value an empty string to be populated when found
            self.output_data[len(self.output_data)-1][c]=""
            if val!="":
                if ',' in val:
                    # break of the string
                    val = val.split(",")

                    if isinstance(val, list):
                        if len(val)==2:

                            try:
                                self.output_data[len(self.output_data)-1][c]=r[val[0]][val[1]]
                            except:
                                pass
                        if len(val) == 3:
                            if '__array' in val[0]:
                                # todo make modular and combine with below
                                # for distribution__array,format=ArcGIS GeoServices REST API,accessURL
                                val[0] = val[0].replace('__array', '')
                                key = val[1].replace('format=', '')
                                for i in r[val[0]]:
                                    # loop over the array looking for a matching key
                                    if i['format'] == key:
                                        self.output_data[len(self.output_data)-1][c] = i[val[2]]
                                        # we would like to access the webservice and extract it's metadata
                                        if key=='ArcGIS GeoServices REST API':
                                            _file = layers_path + "/" + id + ".json"
                                            _url=self.output_data[len(self.output_data) - 1][c] + '?f=pjson'

                        if len(val) == 4:
                            if '__array' in val[1]:
                                #update the val
                                val[1] = val[1].replace('__array', '')
                                key = val[2].replace('key=', '')
                                for i in r[val[0]][val[1]]:
                                    # loop over the array looking for a matching key
                                    if i['key']==key:
                                        self.output_data[len(self.output_data)-1][c] = i[val[3]]
                else:
                    if '{id}' in val:
                        self.output_data[len(self.output_data)-1][c] = val.replace('{id}',id)
                    else:
                        self.output_data[len(self.output_data)-1][c] = r[val]
        if _file:
            self.load_file_call_func(_file,_url ,
                                     'check_sub_loaded', len(self.output_data) - 1)
        else:
            self.complete_resource_ids.append(id)



    def check_sub_loaded(self, data, _output_data_id):
        """
        We're going a level deeper here and looking at the layers associated with a record
        :param data: the json structure ready for parsing
        :param parent_obj:
        :return:

        We're looking to populate
        "column name":"",
        "column field name":"",
        "column type":"",
        "columns description":"", # needs to be tested with valid record
        """
        # map the output data id to the output data
        table_date={
            'name_list' : [],
            'field_list': [],
            'type_list': [],
        }
        if not data:
            # 404 error
            self.complete_resource_ids.append(id)
            return


        for f in data["fields"]:
            table_date['name_list'].append(f['alias'])
            table_date['field_list'].append(f['name'])
            #convert esri type to either Number,Text
            genereic_type ='Number'
            if 'String' in f['type']:
                genereic_type='Text'
            table_date['type_list'].append(genereic_type)

        self.output_data[_output_data_id]["column name"]=table_date['name_list']
        self.output_data[_output_data_id]["column field name"] = table_date['field_list']
        self.output_data[_output_data_id]["column type"] = table_date['type_list']
        self.complete_resource_ids.append(id)

        if len(self.complete_resource_ids) == len(self.loaded_resource_ids):
            self.harvester.wrap_it_up(self.output_data)


    def load_file(self,_file, _func, parent_obj=False):
        """

        :param _file: : The name (w/ path) of the file to save - relayed from "load_file_call_func"
        :param _func: _func: The function to call upon completion - relayed from "load_file_call_func"
        :param parent_obj: Extra info to retain when loading - relayed from "load_file_call_func"
        :return: None
        """
        try:
            _json = self.open_json(_file)
        except:

            _json = self.parse_json(_file)

        getattr(self, _func)(_json, parent_obj)


    def open_json(self,_file):
        """

        :param _file: The name (w/ path) of the local file to open
        :return: interprets text as JSON
        """
        try:
            outfile = open(_file)
            _json = json.load(outfile)
            outfile.close()
            return _json
        except:
            raise


    def parse_json(self,_file):
        """
        Extracts the JSON form malformed file
        :param _file: The name (w/ path) of the local file to open
        :return: A JSON file
        """
        outfile = open(_file)
        s = outfile.read()
        _json = s[s.find("(") + 1:s.rfind(")")]
        outfile.close()
        try:
            return json.loads(_json)
        except:
            return False

  