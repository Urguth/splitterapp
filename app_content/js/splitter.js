function splitter() {};

splitter.prototype = {
  removeFirstBlankChar: function (s) {
    if (s.substr(0, 1) === " ")
      return s.substr(1, s.length);
    else
      return s;
  },
  getPostNum: function (s, i) {
    if (i === 1) {
      if (s.indexOf("PSČ") !== -1) {
        return s.substr(s.indexOf("PSČ") + 4, s.length);
      } else {
        return "";
      }
    } else {
      return s.substr(0, 5);
    };
  },
  splitAdress: function (s, a, o) {
    if (s.substr(s.indexOf("IČ") + 11, s.length).indexOf("<br>") !== -1) {
      a.push(s.indexOf("<br>") + 5)
      if (s.substr(a[0], s.length).indexOf("<br>") !== -1) {
        a.push(s.substr(a[0], s.length).indexOf("<br>") + a[0] + 4);
        if (s.substr(a[1], s.length).indexOf("<br>") !== -1) {
          //  3 adresy
          a.push(s.substr(a[1], s.length).indexOf("<br>") + a[1] + 4);
          var psc = this.getPostNum(s.substr(a[2], s.length), 3);
          return {
            "adress1": this.removeFirstBlankChar(s.substr(a[0], a[1] - a[0] - 4)), 
            "adress2": this.removeFirstBlankChar(s.substr(a[1], a[2] - a[1] - 4)), 
            "adress3": this.removeFirstBlankChar(s.substr(a[2], s.length).split(psc).join("")), 
            "PSC": psc
          }
        } else {
          // 2 dresy
          var psc = this.getPostNum(s.substr(a[1], s.length), 2);
          return {
            "adress1": this.removeFirstBlankChar(s.substr(a[0], a[1] - a[0] - 4)), 
            "adress2": this.removeFirstBlankChar(s.substr(a[1], s.length).split(psc).join("")),
            "adress3": "",
            "PSC": psc
          }
        }
      } else {
        // 1 adresa
        var psc = this.getPostNum(s.substr(a[0], s.length), 1);
        var str = s.substr(a[0], s.length).split("PSČ " + psc).join("");
        if(str.substr(str.length-2, str.length) === ", ") str = str.substr(0, str.length-2)
        return {
          "adress1": this.removeFirstBlankChar(str),
          "adress2": "",
          "adress3": "",
          "PSC": psc
        }
      }
    } else {
      console.log("Adresa nenalezena");
    }
  }
};

module.exports = splitter;