//create a filter manager to control the selection of items from a CSV file
var filter_manager;

$( function() {

    filter_manager = new Filter_Manager({
        csv:"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8j9KmPpm_fwMVy8bIdSowQx40EP1cqvkG4JZEsvTSYXMYVmv73p_RHirS1gttOA/pub?gid=1308010111&single=true&output=csv",
        omit_result_item:["id","column name","column field name","column types","column description"], // define which attributes not to show when a selection is made
        omit_filter_item:["id","Description","Webpage","Download link","Web service","Local file name","Metadata link","column field name","column types","column description","No. Records","Date Accessed","Contact Name","Contact Phone","Contact Email","Has data download","Notes","bbox"],
        path_col:"Webpage",// the url to the dataset landing page
        title_col:"Title",
        sub_title_col:"Organization",
        params:getParams(window.location.href),
        table_data_col:["column name","column field name","column types","column description"],
        table_manager: new Table_Manager({}),
        include_col:'include',// values with 'y' will show-up in list
        comma_separated_col:['Keywords']
     })

     // initialize this filtering system
     filter_manager.init();
        $("#search").focus();
        $("#search_clear").click(function(){
        $("#search").val("")
    })
    //auto adjusting frame height
    $('iframe').load(function() {
        //fade out the overlay;
      if($("iframe").attr("src")!=""){
       $(".overlay").fadeOut();
         //inject some css to iframe
        $("iframe").contents().find("head").append("<style>*{box-sizing:content-box;-webkit-box-sizing: content-box;}.col-md-3 {width: auto;}</style>");

      }
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
