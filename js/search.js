//Getting the search query
var search_query = document.getElementById('search').textContent


var linksbox = document.getElementById('doc');
linksbox.textContent = "http://codewaleed.me<>waleed<>Waleed<>Some"+ "\n"
linksbox.textContent += "http://mohamedkhalid.me<>khalid<>Khalid<>Some"

var results = new Array()

function search()
{
    var all_links = linksbox.textContent
    var index = all_links.split("\n")
    for(var i = 0; i < index.length; i++)
    {
        var url = index[i].split("<>")[0]
        var keyword = index[i].split("<>")[1]
        var title = index[i].split("<>")[2]
        var description = index[i].split("<>")[3]

        var link = new Link(url, keyword, title, description)
        results[results.length] = link;
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
    }
}

search()