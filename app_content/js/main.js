function main(req, jsdom, fs, res) {
  this.req = req;
  this.jsdom = jsdom;
  this.fs = fs;
  this.res = res;
  this.clientUrl = "https://seznam.gov.cz/ovm/poList.do?start=";
  this.count = -1;
  this.pageTabs = 30;
  this.pages = 8;
  this.jsonArr = [];
}
main.prototype = {
  saveFile: function () {
    var myJSONString = JSON.stringify(this.jsonArr, null, 2);
    var myEscapedJSONString = myJSONString.replace(/\\n/g, "\\n")
      .replace(/\\'/g, "")
      .replace(/\\"/g, '')
      .replace(/\\&/g, "")
      .replace(/\\r/g, "")
      .replace(/\\t/g, "")
      .replace(/\\b/g, "")
      .replace(/\\f/g, "");
    this.fs.writeFile('./app_content/json/table_content.json', myEscapedJSONString, (err) => {
      err ? console.log(err) : [this.res.end()];
    });
  },
  init: function () {
    this.count === this.pages - 1 ? this.saveFile() : [this.count++, this.loadSite()];
  },
  parseHtml: function (el) {
    for (var i = 0, length = el.length; i < length; ++i) {
      var isds = el[i].getElementsByTagName('a')[0].href;
      isds = isds.substr(isds.length-7,isds.length);
      var nazev = el[i].getElementsByTagName('a')[0].getElementsByClassName('preWrap')[0].innerHTML.split('&#034;').join(""); 
      var ic = el[i].textContent.substr(el[i].textContent.indexOf("IČ") + 3, 8).replace(/^\s+|\s+$/g, "");
      var adress = this.Splitter.splitAdress(el[i].innerHTML.replace(/^\s+|\s+$/g, ""), [], {})
      var adress1Reverse = adress.adress1.split("").reverse().join("");
      adress.adress1 =  adress.adress1.substr(adress.adress1.length-adress1Reverse.indexOf("   "), adress.adress1.length)
      this.jsonArr.push({
        "isds": isds,
        "post": true,
        "nazev": nazev,
        "ic": ic,
        "adresa": adress.adress1.split("\n").join(""),
        "adresa2": adress.adress2.split("\n").join(""),
        "adresa3": adress.adress3.split("\n").join(""),
        "PSC": adress.PSC.split("\n").join(""),
      });
    }
    this.init();
  },
  loadSite: function () {
    var url = this.clientUrl + String(Number(this.count * this.pageTabs) + 1);
    this.req(url, (err, body, res) => {
      if (err && res.statusCode !== 200) console.log(err);
      this.jsdom.env({
        html: body,
        done: (err, window) => {
          var t = window.document.getElementsByClassName('content databoxes')[0];
          var td = t.querySelectorAll("td");
          this.parseHtml(td);
        }
      });
    });
  }
}

module.exports = main;