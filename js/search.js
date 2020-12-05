var searchbox = document.getElementById('search');
searchbox.contentEditable = true;
searchbox.focus();

var linksbox = document.getElementById('doc');
linksbox.value = "https://google.com<>google<>Google<>Search anything" + "\n";
linksbox.value += "https://bing.com<>bing<>Bing<>Search anything" + "\n";
linksbox.value += "https://google.com<>search<>Google<>Search anything" + "\n";
linksbox.value += "https://bing.com<>search<>Bing<>Search anything" + "\n";

var results = new Array()

var AllRecords;

function search(word)
{
    var all_links = linksbox.value
    var index = all_links.split("\n")
    for(var i = 0; i < index.length; i++)
    {
        var url = index[i].split("<>")[0]
        var keyword = index[i].split("<>")[1]
        var title = index[i].split("<>")[2]
        var description = index[i].split("<>")[3]

        if(keyword == word)
        {
            var link = new Link(url, keyword, title, description)
            results.push(link);
        }
    }
    for(var i=0;i<results.length;i++)
    {
        console.log(results[i].keyword + "<>" + results[i].url)
    }
}

let Link = class
{
    constructor(url, keyword, title, description)
    {
        this.url = url;
        this.keyword = keyword;
        this.title = title;
        this.description = description;
        this.relevance = 0;
    }
}

function addItem(link){
    $('#dynamic-list').append("<li class='link'><div class='advance-search'><a href='"+link.url+"'><strong>"+link.title+"</strong></a><p>"+link.description+"</p></div></li>")
}

function generateResults()
{
    //Getting the search query
    results = []
    var rankedResults = new Array()
    var search_query = document.getElementById('search').value
    var words = search_query.split(" ")
    for(var i = 0; i < words.length; i++)
    {console.log("Entered search loop" +i)
        search(words[i])
    }
    console.log("remove duplicate urls by increamenting relevance " +results.length)
    for(var i = 0; i < results.length; i++)
    {
        var addlink = true
        // check if the current url already exists in the ranked results list
        // if it does then increament the relevance by 1
        for(var j = 0; j < rankedResults.length; j++)
        {
            if(results[i].url == rankedResults[j].url )
            {
                rankedResults[j].relevance += 1
                addlink = false
                console.log("increamenting relevance of "+rankedResults[j].url+" by "+rankedResults[j].relevance)
            }
        }
        if(addlink)
        {
            rankedResults.push(results[i])
            console.log("added link: "+rankedResults[i].url)
        }
    }
    console.log(rankedResults)
    //Performing selection sort on the array
    for(var i = 0; i < rankedResults.length; i++)
    {
        for(var j = i+1; j < rankedResults.length; j++)
        {
            if(rankedResults[i].relevance < rankedResults[j].relevance)
            {
                var temp = rankedResults[i]
                rankedResults[i] = rankedResults[j]
                rankedResults[j] = temp
            }
        }
    }
    for(var i=0;i<rankedResults.length;i++)
    {
        console.log(rankedResults[i].url)
    }
    $('#dynamic-list').empty()
    for(var i = 0; i < rankedResults.length; i++)
    {
        addItem(rankedResults[i])
    }
    document.getElementById('search').value = ""
    if(event.preventDefault) event.preventDefault();
}

//========================================================================

// $("#getbutton").click(function(){
//     $.ajax({
//       type: "GET",
//       url: '/nodes/' + "Sync",
//       success: function(result){
//         //$('#doc').text(JSON.stringify(result));
//         linksbox.value = ""
//         for(var i = 0; i < result.crawledLinks.length; i++)
//         {
//             linksbox.value += result.crawledLinks[i] + "\n";
//         }
        
//         linksbox.fireEvent('input')
//         // .crawledLinks.foreach(function(record){linksbox.textContent = linksbox.textContent + record})
//       }
  
//     });
//     //linksbox.textContent = JSON.stringify(AllRecords)
// });
window.setInterval(function(){
    $.ajax({
        type: "GET",
        url: '/nodes/' + "Sync",
        success: function(result){
          //$('#doc').text(JSON.stringify(result));
          linksbox.value = ""
          for(var i = 0; i < result.crawledLinks.length; i++)
          {
              linksbox.value += result.crawledLinks[i] + "\n";
          }
          
        //   linksbox.fireEvent('input')
          // .crawledLinks.foreach(function(record){linksbox.textContent = linksbox.textContent + record})
        }
    
      });
      //linksbox.textContent = JSON.stringify(AllRecords)
}, 10000)
//========================================================================

// window.onkeydown=function(event){
//     if(event.keyCode==13){
//         sendNew();
//         if(event.preventDefault) event.preventDefault(); // This should fix it
//         return false; // Just a workaround for old browsers
//     }
// }
