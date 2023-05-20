//create a filter manager to control the selection of items from a CSV file
var filter_manager;
var usp={};// the url params object to be populated
var LANG;
var map_manager;
var layer_manager;
$( function() {



    $.getJSON('i18n/en.json', function(data){
            LANG=data
            initialize_interface()
    });
    // adjust the size of the windows depending on the view
    /*
    ____________
    |  header  |
    ------------
    |c1|c2| c3 |

    */
    $( window ).resize(function() {
        var header_height=$("#header").height();
        var window_height= $(window).height()
        var window_width= $(window).width()

        $("#filter_area").height(window_height-header_height-40)

        $("#content").height(window_height-header_height-40)
    });
    $( window ).trigger("resize")

});

function initialize_interface(){

    var sort_str=""
    if(!$.isEmptyObject(usp) && usp.get("sort")){
        sort_str=usp.get("sort")
    }

    $("[for='filter_bounds_checkbox']").text(LANG.SEARCH.LIMIT)
    $("#filter_date_to").text(LANG.SEARCH.TO)
    $("[for='filter_date_checkbox']").text(LANG.SEARCH.LIMIT_DATE)

    $("#radio_data_label").text(LANG.SEARCH.RADIO_DATA_LABEL)

    $("#radio_place_label").text(LANG.SEARCH.RADIO_PLACE_LABEL)
    //
    setup_filters()

//    disclaimer_manager.init();
//    //
//    table_manager.init();
//
//    download_manager.init();

    init_tabs()

    //layer_manager.add_basemap_control()
}
function setup_filters(){
    filter_manager = new Filter_Manager({
        csv:"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8j9KmPpm_fwMVy8bIdSowQx40EP1cqvkG4JZEsvTSYXMYVmv73p_RHirS1gttOA/pub?gid=1308010111&single=true&output=csv",
        omit_result_item:["id","column name","column field name","column types","column description"], // define which attributes not to show when a selection is made
        omit_filter_item:["id","Title","Description","Webpage","Download link","Web service","Local file name","Metadata link","column field name","column types","column description","No. Records","Date Accessed","Contact Name","Contact Phone","Contact Email","Has data download","Notes","bbox"],
        path_col:"Webpage",// the url to the dataset landing page
        title_col:"Title",
        sub_title_col:"Organization",
        params:getParams(window.location.href),
        table_data_col:["column name","column field name","column types","column description"],
        table_manager: new Table_Manager({}),
        include_col:'include',// values with 'y' will show-up in list
        comma_separated_col:['Keywords',"column name","Topic"]
     })

     // initialize this filtering system
     filter_manager.init();
        $("#search").focus();
        $("#search_clear").click(function(){
            $("#search").val("")
        })

}

function init_tabs(){
    $("#search_tab").text(LANG.TAB_TITLES.BROWSE_TAB)
    $("#map_tab .label").text(LANG.TAB_TITLES.MAP_TAB)
    $("#download_tab").text(LANG.TAB_TITLES.DOWNLOAD_TAB)
    $(".tab_but").click(function() {
        $(".tab_but").removeClass("active")
        $(this).addClass("active")
        // hide all tab_panels
         $(".tab_panel").hide()
         // show only this one by assuming it's name from the button
         var tab_panel_name = $(this).attr("id").substring(0,$(this).attr("id").indexOf("_"))+"_panel_wrapper"

         $("#"+tab_panel_name).show()
        // save_params()

    });
     filter_manager.slide_position()
    // click the tab and slide to the panel as appropriate
//    if( !$.isEmptyObject(usp) && usp.get("t")){
//
//       move_to_tab(usp.get("t"))
//    }
}

function move_to_tab(tab_str){
    var tab_parts = tab_str.split("/")

    // move to the set search panel
    if(tab_parts.length>1){
        filter_manager.slide_position(tab_parts[1])
    }
    if(tab_parts.length>2){
       filter_manager.display_resource_id = tab_parts[2]
    }

   //auto click the tab for state saving
   $("#"+tab_parts[0]).trigger("click")
}