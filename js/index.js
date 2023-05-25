//create a filter manager to control the selection of items from a CSV file
var filter_manager;
var table_manager;
var usp={};// the url params object to be populated
var LANG;
var map_manager;
var layer_manager;
var analytics_manager;
if (typeof(params)=="undefined"){
    var params = {}
}
var last_params={}
var usp={};// the url params object to be populated

var browser_control=false; //flag for auto selecting to prevent repeat cals

$( function() {

    $.getJSON('i18n/en.json', function(data){
            LANG=data
            initialize_interface()
    });

    $( window ).resize( window_resize);
    setTimeout(function(){
             $( window ).trigger("resize");

             // leave on the dynamic links - turn off the hrefs
             $("#browse_panel .card-body a").attr('href', "javascript: void(0)");

             // rely on scroll advance for results
             $("#next_link").hide();


            // update paging

            filter_manager.update_parent_toggle_buttons(".content_right")
            filter_manager.update_parent_toggle_buttons("#details_panel")
            filter_manager.update_toggle_button()
            if(! DEBUGMODE){
                $("#document .page_nav").hide()
            }else{
                //append d=1, so that debug mode remains
                $("#document .page_nav a").each(function() {
                   $(this).attr("href",  $(this).attr("href") + '&d=1');
                });
            }
    },500)
        //update the height of the results area when a change occurs
        $('#side_header').bind('resize', function(){
        $("#result_wrapper").height($("#panels").height()-$("#result_total").height()- $('#side_header'))
    });
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

    setup_params()
    table_manager = new Table_Manager({
    elm_wrap:"data_table_wrapper",
          elm:"data_table"})
    setup_filters()
     setup_map()

     analytics_manager = new Analytics_Manager();
//    disclaimer_manager.init();
//    //
//    table_manager.init();
//
//    download_manager.init();

    init_tabs()
}
function setup_params(){
    if (window.location.search.substring(1)!="" && $.isEmptyObject(params)){
        usp = new URLSearchParams(window.location.search.substring(1).replaceAll("~", "'").replaceAll("+", " "))

        if (usp.get('f')!=null){
            params['f'] = rison.decode("!("+usp.get("f")+")")
        }
        if (usp.get('e')!=null){
            params['e'] =  rison.decode(usp.get('e'))
        }

        if (usp.get('l')!=null && usp.get('l')!="!()"){
            params['l'] =  rison.decode(usp.get('l'))
        }

        // debug mode
        if (usp.get('d')!=null){
           DEBUGMODE=true
        }



    }

}
function setup_filters(){
    filter_manager = new Filter_Manager({
        csv:"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8j9KmPpm_fwMVy8bIdSowQx40EP1cqvkG4JZEsvTSYXMYVmv73p_RHirS1gttOA/pub?gid=1308010111&single=true&output=csv",
        omit_result_item:["id","column name","column field name","column types","column description","Local file name"], // define which attributes not to show when a selection is made
        omit_filter_item:["id","Title","Description","Webpage","Download link","Web service","Local file name","Metadata link","column field name","column types","column description","No. Records","Date Accessed","Contact Name","Contact Phone","Contact Email","Has data download","Notes","bbox"],
        path_col:"Webpage",// the url to the dataset landing page
        title_col:"Title",
        sub_title_col:"Organization",
        params:params['f'],
        table_data_col:["column name","column field name","column types","column description"],
        table_manager: table_manager,
        include_col:'include',// values with 'y' will show-up in list
        comma_separated_col:['Keywords',"column name","Topic"],
        bounds_col:'bbox',
        place_url:'https://nominatim.openstreetmap.org/search?format=json',
        viz_col:["Download link","Web service"],
        download_link:"Download link"
     })

     // initialize this filtering system
     filter_manager.init();
        $("#search").focus();
        $("#search_clear").click(function(){
            $("#search").val("")
        })

}
function setup_map(){
    map_manager = new Map_Manager(
     {params:params['e'] ,
        lat:36.25408922222581,
        lng: -98.7485718727112,
        z:3,
        limit:100 // max results for identify
        })

     map_manager.init()
     map_manager.init_image_map()

      layer_manager = new Layer_Manager({
        map:map_manager.map,
        layers_list:params['l']
      })

      layer_manager.add_basemap_control()
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
// enable back button support
window.addEventListener('popstate', function(event) {
    var _params={}
    usp = new URLSearchParams(window.location.search.substring(1).replaceAll("~", "'").replaceAll("+", " "))

        if (usp.get('f')!=null){
            _params['f'] = rison.decode("!("+usp.get("f")+")")
        }
        if (usp.get('e')!=null){
            _params['e'] =  rison.decode(usp.get('e'))
        }

        if (usp.get('l')!=null && usp.get('l')!="!()"){
            _params['l'] =  rison.decode(usp.get('l'))
        }
        browser_control=true
        filter_manager.remove_filters()
        filter_manager.filters=[]
        $("#filter_bounds_checkbox").prop("checked", false)
        filter_manager.set_filters(_params['f'])
        filter_manager.filter()

        move_to_tab( usp.get("t"))


        map_manager.move_map_pos( _params['e'])
        browser_control=false

}, false);
function window_resize() {
        var data_table_height=0
         if( $("#data_table_wrapper").is(":visible")){
           data_table_height= $("#data_table_wrapper").height()
        }
        var header_height=$("#header").outerHeight();
        var window_height= $(window).outerHeight()
        var window_width= $(window).width()

       $("#content").height(window_height-header_height)

       $("#map_wrapper").height(window_height-header_height-data_table_height)
       var scroll_height=window_height-header_height-$("#side_header").outerHeight()-$("#tabs").outerHeight()-$("#nav_wrapper").outerHeight()-20
       $("#panels").height(scroll_height)
       $(".panel").height(scroll_height)
       $("#result_wrapper").height(scroll_height)


        $("#map_panel_wrapper").height(window_height-$("#tabs").height()-header_height)
        $("#map_panel_scroll").height(window_height-$("#tabs").height()-header_height)

            //
//       $("#tab_panels").css({'top' : ($("#tabs").height()+header_height) + 'px'});

//       .col-xs-: Phones (<768px)
//        .col-sm-: Tablets (≥768px)
//        .col-md-: Desktops (≥992px)
//        .col-lg-: Desktops (≥1200px)


       if (window_width >768){

            // hide the scroll bars
            $('html, body').css({
                overflow: 'hidden',
                height: '100%'
            });
            $("#map_wrapper").width(window_width-$("#side_bar").width()-1)
            $("#data_table_wrapper").width(window_width-$("#side_bar").width()-1)

            map_manager.map.scrollWheelZoom.enable();
       }else{
             //mobile view

             // scroll as needed
             $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });

            // drop the map down for mobile
            $("#map_wrapper").width(window_width)
            $("#data_table_wrapper").width(window_width)

            map_manager.map.scrollWheelZoom.disable();
       }
        //final sets
        $("#panels").width($("#side_bar").width())
        $(".panel").width($("#side_bar").width())
        if(map_manager){
            map_manager.map.invalidateSize()
        }
        // slide to position
         $("#panels").stop(true, true)
         // if we are on the search tab, make sure the viewable panel stays when adjusted
        if("search_tab"==$("#tabs").find(".active").attr("id")){
            filter_manager.slide_position(filter_manager.panel_name)
        }


 }
 function save_params(){
    // access the managers and store the info URL sharing

    var p = "?f="+encodeURIComponent(rison.encode(filter_manager.filters))
    +"&e="+rison.encode(map_manager.params)

    if(layer_manager && typeof(layer_manager.layers_list)!="undefined"){
        p+="&l="+rison.encode(layer_manager.layers_list)
    }

    p+='&t='+$("#tabs").find(".active").attr("id")
    if(typeof(filter_manager.panel_name)!="undefined"){
        // add the panel if available
        p+="/"+filter_manager.panel_name;
    }
    if(typeof(filter_manager.display_resource_id)!="undefined"){
        // add the display_resource_id if available
        p+="/"+filter_manager.display_resource_id;
    }

    if (filter_manager.page_rows){
        p +="&rows="+(filter_manager.page_start+filter_manager.page_rows)
    }
    if (filter_manager.page_start){
        p +="&start=0"
    }
    if (filter_manager.sort_str){
        p +="&sort="+filter_manager.sort_str
    }
//    if (filter_manager.fq_str){
//        p +="&fq="+filter_manager.fq_str
//    }
    // retain debug mode
    if (DEBUGMODE){
        p +="&d=1"
    }

    // before saving the sate, let's make sure they are not the same
    if(JSON.stringify(p) != JSON.stringify(last_params) && !browser_control){
       window.history.pushState(p, null, window.location.pathname+p.replaceAll(" ", "+").replaceAll("'", "~"))
        last_params = p
    }

}