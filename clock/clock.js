var update_loop = setInterval(Main, 1000);


Main();

function Main(){
    var time = new Date();
    var h =  time.getHours();
    var m =  time.getMinutes();
    var s =  time.getSeconds();
 
    var oldClock = document.getElementById("textClock");
    var newClock = textClock(h, m, s);

    oldClock.parentNode.replaceChild(newClock, oldClock);
}

function textClock(h, m, s) {
    var klst = ["Tólf", "Eitt", "Tvö", "Þrjú", "Fjögur", "Fimm", "Sex", "Sjö", "Átta", "Níu", "Tíu", "Ellefu"];

    var clock = document.createElement("div");
    clock.className = "textClock";
    clock.id = "textClock";
    var secDiv = document.createElement("div");
    secDiv.className = "timeDiv secDiv "+ s;
    var minDiv = document.createElement("div");
    minDiv.className = "timeDiv minDiv " + m;
    var hourDiv = document.createElement("div");
    hourDiv.className = "timeDiv hourDiv " + h;

    var and = document.createElement("p");
    and.className = "and";
    
    // Þyngd á einingu = bold or not range 100-900 ok 
    // Stærð á tug = range 1 - 2 rem, set em ok 
    // Hour fer á bæði,,, 
    // var minWeight = Map(100,900)

    var minNum = document.createElement("p");
    var minPro = document.createElement("p");
    var secNum = document.createElement("p");
    var secPro = document.createElement("p");
    var hourNum = document.createElement("p");

    var fromTo = document.createElement("p");
    fromTo.classList.add("fromTo");

    //Whole hour
    if (m===0 && s===0){
        var time =  document.createElement("p");
        time.className = "fullhour hour " + h%12;
        var node = document.createTextNode(klst[h%12]);
        time.appendChild(node);
        hourDiv.appendChild(time);
    }
    //Half hour
    else if (m===30 && s===0){
        var half = document.createElement("p");
        var time =  document.createElement("p");

        half.classList.add("half");
        time.classList.add(["halfhour", "hour", (h+1)%12]);

        var halfnode = document.createTextNode("Hálf");
        var timenode = document.createTextNode(klst[(h+1)%12]);
        
        half.appendChild(halfnode);
        time.appendChild(timenode);
        
        hourDiv.appendChild(half);
        hourDiv.appendChild(time);
    } else {
        var outS = s;
        var outM = m;
        var outH = h; 
        if (m >= 30) {
            outS = 60-s;
            outM = 60-m;
            outH = h+1;
            var fromToNode = document.createTextNode("í");
            fromTo.classList.add("to");
        } else {
            var fromToNode = document.createTextNode("yfir");
            fromTo.classList.add("over");
        }
    
        var andNode = document.createTextNode("og");
        and.appendChild(andNode);
    
        var minNumNode = document.createTextNode(" " + getText(outM));
        var minProNode = document.createTextNode(" mínútu" + plural(outM));
        
        var secNumNode = document.createTextNode(getText(outS));
        var secProNode = document.createTextNode(" sekúndu" + plural(outS));       
        
        var hourNode = document.createTextNode(klst[outH%12]);
        
        if (m !== 0) {
            minNum.appendChild(minNumNode);
            minPro.appendChild(minProNode);
            minDiv.appendChild(minNum);
            minDiv.appendChild(minPro);
            clock.appendChild(minDiv);
        }
        if (m !== 0 && s !== 0) {
            clock.appendChild(and);
        }
    
        if (s !== 0 ) {
            secDiv.appendChild(secNum);
            secDiv.appendChild(secPro);
            secNum.appendChild(secNumNode);
            secPro.appendChild(secProNode);
            clock.appendChild(secDiv);
        }
    
        fromTo.appendChild(fromToNode);
        clock.appendChild(fromTo);
        
        hourNum.appendChild(hourNode);
        hourDiv.appendChild(hourNum);
        clock.appendChild(hourDiv);
    
        animate(secNum, outS, 0, 59);
        animate(minNum, outM, 0, 59);
        animate(hourNum, outH%12, 0, 11);
    }
    return clock;
}

function addToHtml(h, m, s){
    if (m >= 30) {
        s = 60-s;
        m = 60-m;
        var fromToNode = document.createTextNode("í");
        fromTo.classList.add("to");
    } else {
        var fromToNode = document.createTextNode("yfir");
        fromTo.classList.add("over");
    }

    var andNode = document.createTextNode("og");
    and.appendChild(andNode);

    var minNumNode = document.createTextNode(getText(m));
    var minProNode = document.createTextNode("mínútu" + plural(m));
    
    var secNumNode = document.createTextNode(getText(s));
    var secProNode = document.createTextNode("sekúndu" + plural(s));       
    
    var hourNode = document.createTextNode(klst[(h+1)%12]);
    
    if (m !== 0) {
        minNum.appendChild(minNumNode);
        minPro.appendChild(minProNode);
        minDiv.appendChild(minNum);
        minDiv.appendChild(minPro);
        clock.appendChild(minDiv);
    }
    if (m === 0 || s === 0) {
        clock.appendChild(and);
    }

    if (s !== 0) {
        secDiv.appendChild(secNum);
        secDiv.appendChild(secPro);
        secNum.appendChild(secNumNode);
        secPro.appendChild(secProNode);
        clock.appendChild(secDiv);
    }

    fromTo.appendChild(fromToNode);
    clock.appendChild(fromTo);
    
    hourNum.appendChild(hourNode);
    hourDiv.appendChild(hourNum);
    clock.appendChild(hourDiv);

    animate(secNum, s, 0, 59);
    animate(minNum, m, 0, 59);
    animate(hourNum, h%12, 0, 11);
}

function plural(i){
    return (i%10 === 1 && i!==11) ? '' : 'r';
}

// Set shaddow and size of node
function animate(node, num, min, max) {
    // min Weight 100 max 900
    var w = scale(num, min, max, 1, 2);
    var s = scale(num, min, max, 1, 2);

    node.style.cssText = "text-shadow: 0 0 "+ w +"em #FF0000; font-size: " + s +"em"; 
}

function scale (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getText(number) {
    var numbs = ["Núll", "Eina", "Tvær", "Þrjár", "Fjórar", "Fimm", "Sex", "Sjö", "Átta", "Níu", "Tíu", "Ellefu", "Tólf", "Þrettán", "Fjórtán", "Fimmtán", "Sextán", "Sautján", "Átján", "Nítján"];
    var tugir = ["Núll", "Tíu", "Tuttugu", "Þrjátíu", "Fjörutíu", "Fimmtíu"];

    if (number>=20) {
        var first = Math.floor(number/10);
        var later = number % 10;
        if (later == 0) return tugir[first];
        return tugir[first] + " og " + numbs[later];
    } 
    else {
        return numbs[number];
    }
}