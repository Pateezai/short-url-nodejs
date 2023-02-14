const copy_btn = document.getElementById('copy-btn')
const short_txt = document.getElementById('short_title')
copy_btn.style.display="none";
short_txt.style.display="none";


async function shorten (){
    let og_url = document.getElementById("og_url").value;
    let custom_url = document.getElementById("custom_url").value;
    //catch url valid and empty?
    // if(!url){
    //     alert('Please put your url!!')
    // }
    //now its check valid value that user input but its require https too but we will gonna assign http or https automatic if its dont have
    

    function isValidUrl(url) {
        // regular expression to match most common URL patterns
        const pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        return pattern.test(url);
    }

    function validateUrl(og_url) {
        if(og_url.startsWith("http://") || og_url.startsWith("https://")){
            return {
                valid : true,
                url: og_url
            };
        }else{
            return {
                valid : true,
                url: `http://${og_url}`
            };
        }
    }

    if (!isValidUrl(og_url)) {
        alert('URL is invalid');
        return;
    }
    let validUrl = validateUrl(og_url);
    og_url = validUrl.url;

    // let final_url = window.location.origin + '/' + custom_url;
    // final_element.innerHTML = '<a id="short-url" href="' + final_url + '">' + final_url + '</a>'
    
    //store and send data to serve-side
    //check if custom_url already exists

    try{
        
        const response =  await fetch('/', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ og_url:og_url, custom_url:custom_url })
            // body: JSON.stringify({ og_url, custom_url, final_url }),

        })
        // console.log(JSON.stringify({ og_url, custom_url }))

        const data = await response.json();
        const is_custom_exist = data.custom_url
        if(is_custom_exist === undefined ){
            alert("custom url existed please try another one")
            console.log("custom exists");
            return;
        }

        const final_element = data.final_url
        const short_url = document.getElementById('short-url')
        short_url.innerHTML = '<a id="lead-url" href="' + `${final_element}` + '">' + `${final_element}` + '</a>'

        // console.log(data);
        // console.log( 'http://localhost/',typeof data.custom_url, data.custom_url);
        // console.log(`${window.location.origin}/${data.custom_url}`);
        // console.log(typeof data.og_url, data.og_url);
        console.log(typeof data.final_url, data.final_url);
        copy_btn.style.display="block"; 
        short_txt.style.display="flex";
        //----
    }catch(error){
        console.log(error)
    }
    
    document.getElementById("og_url").value = '';
    document.getElementById("custom_url").value = '';
}


function copy_url(){

    const store = document.getElementById("store-url");
    const lead = document.getElementById("lead-url");
    const copy = lead.innerText;
    console.log(store)
    console.log(copy)

    store.setAttribute('value', copy);
    store.select();
    navigator.clipboard.writeText(store.value);
    copy_btn.innerHTML = 'Copied!';

}