var searchbox = document.getElementById('search');
searchbox.contentEditable = true;
searchbox.focus();

var linksbox = document.getElementById('doc');
linksbox.textContent = "https://google.com<>google<>Google<>Search anything" + "\n"
linksbox.textContent += "https://bing.com<>bing<>Bing<>Search anything" + "\n"
linksbox.textContent += "https://google.com<>search<>Google<>Search anything" + "\n"
linksbox.textContent += "https://bing.com<>search<>Bing<>Search anything" + "\n"

var results = new Array()

var AllRecords;

function search(word)
{
    var all_links = linksbox.textContent
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
            results[results.length] = link;
            console.log(results[results.length - 1].keyword + "<>" + results[results.length - 1].url)
        }
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
    var ul = document.getElementById("dynamic-list");
    var li = document.createElement("li");
    li.setAttribute('id',link.relevance);
    var node = document.createElement("A")
    node.innerHTML = link.title + "<br/>" + link.description
    node.href = link.url
    li.appendChild(node);
    ul.appendChild(li);
}

// function removeItem(link){
//     var ul = document.getElementById("dynamic-list");
//     var item = document.getElementById(link.relevance);
//     ul.removeChild(item);
//     ul.remo
// }

function generateResults()
{
    //Getting the search query
    var rankedResults = new Array()
    var search_query = document.getElementById('search').textContent
    var words = search_query.split(" ")
    for(var i = 0; i < words.length; i++)
    {
        search(words[i])
    }
    console.log("remove duplicate urls by increamenting relevance" + rankedResults.length)
    for(var i = 0; i < results.length; i++)
    {
        var addlink = true
        // check if the current url already exists in the ranked results list
        // if it does then increament the relevance by 1
        for(var j = 0; j < rankedResults.length; j++)
        {
            if((rankedResults[j].url != null) && results[i].url == rankedResults[j].url )
            {
                rankedResults[j].relevance += 1
                addlink = false
            }
        }
        if(addlink)
        {
            rankedResults[rankedResults.length] = results[i]
        }
    }
    
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

    for(var i = 0; i < rankedResults.length; i++)
    {
        console.log(rankedResults[i].url + "<>" + rankedResults[i].relevance)
        addItem(rankedResults[i])
    }
}

//========================================================================

$("#getbutton").click(function(){
    $.ajax({
      type: "GET",
      url: '/nodes/' + "Sync",
      success: function(result){
        //$('#doc').text(JSON.stringify(result));
        for(var i = 0; i < result.crawledLinks.length; i++)
        {
            linksbox.textContent += result.crawledLinks[i] + "\n";
        }
        // .crawledLinks.foreach(function(record){linksbox.textContent = linksbox.textContent + record})
      }
  
    });
    //linksbox.textContent = JSON.stringify(AllRecords)
});

//========================================================================