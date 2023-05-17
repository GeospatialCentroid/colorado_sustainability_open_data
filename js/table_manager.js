class Table_Manager {
  constructor(properties) {

    //store all the properties passed
    for (var p in properties){
        this[p]=properties[p]
    }


  }
  init(){

  }
  get_combined_table_html(header,cols){
      var html= "<table class='fixed_headers'><thead><tr>"
      for (var p in header){
         var sort_icon="<i/>"
             if(this.sort_col ==p){
                sort_icon=this.get_sort_icon(this.sort_dir)
             }
            html +="<th><span onclick='table_manager.sort(this,\""+p+"\")'>"+header[p]+" "+sort_icon+"</span></th>";
        }
        html +="</tr></thead><tbody>";

        // use the first column to establish a count

        for (var i =0;i<cols[0].length;i++){
            html+="<tr>"

            for (var c in cols){
                var text = cols[c][i]
                if(text!=undefined){
                    html+="<td>"+text+"</td>"
                }

            }
            html+="<tr>"
        }

         html +="</tbody></table>";
         return html
  }
}