async function getUserIpInfo(ipaddress){
    try{
    let url=`https://ipinfo.io/${ipaddress}/json?token=53fb8c58eb3fc2`;
    const response=await fetch(url);//fetch ipinfo
    if(!response.ok)
        throw "Error fetching your Ip Info Try Again";
    const data=await response.json();
    fetchMapTimePost(data);//called when resp is ok
    }
    catch(msg)
    {
        alert("Error : "+msg);
    }
}

/* will fetch postal api to get postal info and call three functions */
async function fetchMapTimePost(ipinfo) {
    try
    {
        let posturl=`https://api.postalpincode.in/pincode/${ipinfo.postal}`;
        const postresp=await fetch(posturl);//fetch postal api
        if(!postresp.ok)
            throw "Error fetching post offices Try Again";
        const postdata=await postresp.json();

        
        //after 0.5s delay call funcs
        setTimeout(()=>{
            
            putIpInfo(ipinfo);//render fetched ipinfo into the document
            putTimeInfo(ipinfo.timezone,ipinfo.postal,postdata[0].Message);//render fetched ipinfo,postal info into document
            mapPostOffices(postdata);//called to render post offices we got from postal API
            
        },500);
    }
    catch(errmsg){
        alert("Error : "+errmsg);
    }
    
}


//put all the ipinfodata fetched into the ipinfo_container_grid > ipinfo_grid_item > article element.
function putIpInfo(ipinfo) {
    let loc=(ipinfo.loc).split(",");
    document.getElementById("lat").innerHTML=loc[0];
    document.getElementById("long").innerHTML=loc[1];
    document.getElementById("city").innerHTML=ipinfo.city;
    document.getElementById("region").innerHTML=ipinfo.region;
    document.getElementById("org").innerHTML=ipinfo.org
    document.getElementById("host").innerHTML=ipinfo.timezone;


    //render google map by putting lat and long into src of iframe
    document.getElementById("mapframe").src=`https://maps.google.com/maps?q=${loc[0]}, ${loc[1]}&z=15&output=embed`;
    document.getElementById("mapframe").style.display="block";
    
    document.getElementById("ipaddress_btn").style.display="none";
    document.getElementById("ipaddress_label").innerHTML="Your Current IP ADDRESS is:"

    //render the elements when get data btn is clicked
    document.getElementById("ipinfo_container_align").style.display='block';
    document.getElementById("timezone_container_align").style.display='block';
    document.getElementById("postoffice_container_align").style.display='block';

}


/* render timezone data using Date() */
function putTimeInfo(time,pincode,msg) {
    document.getElementById("zone").innerHTML=time;
    document.getElementById("dot").innerHTML=new Date().toLocaleString("en-US", { timeZone: time });
    document.getElementById("pin").innerHTML=pincode;
    document.getElementById("pinmsg").innerHTML=msg;
}


/* will create a section containing required fields for every post offices and append them to the postoffice_grid */
function mapPostOffices(postObj) {
    let postarr=postObj[0].PostOffice;
    postarr.forEach(item => {
        const postoffice=document.createElement("section");
        postoffice.setAttribute("class","postoffice");

        const name=document.createElement("label");
        name.setAttribute("class","postoffice_name");

        const bnchtype=document.createElement('label');
        bnchtype.setAttribute("class","postoffice_branch");

        const delstat=document.createElement("label");
        delstat.setAttribute("class","postoffice_delstat");

        const dist=document.createElement("label");
        dist.setAttribute("class","postoffice_dist");

        const divi=document.createElement("label");
        divi.setAttribute("class","postoffice_div");

        name.innerHTML=`Name: ${item.Name}`;
        bnchtype.innerHTML=`Branch Type: ${item.BranchType}`;
        delstat.innerHTML=`Delivery Status: ${item.DeliveryStatus}`;
        dist.innerHTML=`District: ${item.District}`;
        divi.innerHTML=`Division: ${item.Division}`;

        postoffice.append(name,bnchtype,delstat,dist,divi);
        document.getElementById("postoffice_grid").append(postoffice);
    });
}


/* filter the rendered postoffices after loading according to search input */
 function filterPostOffice(){
    let postofficearr=document.getElementsByClassName("postoffice");//get html collection of post offices
     if(document.getElementById("postoffice_search_input").value !== '')
    {
        let strinput=document.getElementById("postoffice_search_input").value;//get search input value
        for (let i = 0; i < postofficearr.length; i++) 
        {   
            
            let str=postofficearr[i].children[0].innerHTML;//post office name
            let str1=postofficearr[i].children[4].innerHTML; //post office Branch Office
            (str1.startsWith(strinput,13));
            if((str.search(strinput) === -1) && (str1.search(strinput) === -1)){
                postofficearr[i].style.display="none";//if search input found in str and str1 then display none
            }
            else{
                postofficearr[i].style.display='';//else display
            }
        }
    }
    else{
        for (let i = 0; i < postofficearr.length; i++) 
        {
            postofficearr[i].style.display='';//if search input empty then display all
        }
    }
    

} 