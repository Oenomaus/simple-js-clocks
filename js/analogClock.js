(function() {
    function romanize(num) {
        if (!+num)
            return "";
        var digits = String(+num).split(""),
            key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    var radians = 0.0174532925;
    var clockRadius = 200;
    var margin = 50;
    var width = (clockRadius + margin) * 2;
    var height = (clockRadius + margin) * 2;
    var hourHandLength = 2 * clockRadius / 3;
    var minuteHandLength = clockRadius;
    var secondHandLength = clockRadius - 12;
    var secondHandBalance = 30;
    var secondTickStart = clockRadius;
    var secondTickLength = -10;
    var hourTickStart = clockRadius;
    var hourTickLength = -18;
    var secondLabelRadius = clockRadius + 16;
    var secondLabelYOffset = 5;
    var hourLabelRadius = clockRadius - 40;
    var hourLabelYOffset = 7;


    var hourScale = d3.scaleLinear()
        .range([0, 330])
        .domain([0, 11]);

    var minuteScale = secondScale = d3.scaleLinear()
        .range([0, 354])
        .domain([0, 59]);

    var handData = [
        {
            type: "hour",
            value: 0,
            length: -hourHandLength,
            scale: hourScale,
        },
        {
            type: "minute",
            value: 0,
            length: -minuteHandLength,
            scale: minuteScale,
        },
        {
            type: "second",
            value: 0,
            length: -secondHandLength,
            scale: secondScale,
            balance: secondHandBalance,
        },
    ];

    var drawClock = function() {
        updateData();
        var svg = d3.select("#analogClock").append("svg")
            .attr("width", width)
            .attr("height", height);

        var face = svg.append("g")
            .attr("id", "clock-face")
            .attr("transform", "translate(" + (clockRadius + margin) + "," + (clockRadius + margin) + ")");

        
        if (config.analogDisplaySecondsMarks) {
            face.selectAll(".second-tick")
                .data(d3.range(0, 60)).enter()
                .append("line")
                .attr("class", "second-tick")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", secondTickStart)
                .attr("y2", secondTickStart + secondTickLength)
                .attr("transform", function(d) {
                    return "rotate(" + secondScale(d) + ")";
                });
        }
        

        face.selectAll(".second-label")
            .data(d3.range(0, 60, 1))
            .enter()
            .append("text")
            .attr("class", "second-label")
            .attr("text-anchor", "middle")
            .attr("x", function(d) {
                return secondLabelRadius * Math.sin(secondScale(d) * radians);
            })
            .attr("y", function(d) {
                return -secondLabelRadius * Math.cos(secondScale(d) * radians) + secondLabelYOffset;
            })
            .text(function(d) {
                return config.romanize ? romanize(d) : d;
            });

            
        if (config.analogDisplayHoursMarks) {
            face.selectAll(".hour-tick")
                .data(d3.range(0, 12)).enter()
                .append("line")
                .attr("class", "hour-tick")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", hourTickStart)
                .attr("y2", hourTickStart + hourTickLength)
                .attr("transform", function(d) {
                    return "rotate(" + hourScale(d) + ")";
                });
        }

        face.selectAll(".hour-label")
            .data(d3.range(0, 12, 1))
            .enter()
            .append("text")
            .attr("class", "hour-label")
            .attr("text-anchor", "middle")
            .attr("x", function(d) {
                return hourLabelRadius * Math.sin(hourScale(d) * radians);
            })
            .attr("y", function(d) {
                return -hourLabelRadius * Math.cos(hourScale(d) * radians) + hourLabelYOffset;
            })
            .text(function(d) {
                return config.romanize ? romanize(d) : d;
            });


        var hands = face.append("g").attr("id", "clock-hands");

        face.append("g").attr("id", "face-overlay")
            .append("circle").attr("class", "hands-cover")
            .attr("x", 0)
            .attr("y", 0)
            .attr("r", clockRadius / 20);

        hands.selectAll("line")
            .data(handData)
            .enter()
            .append("line")
            .attr("class", function(d) {
                return d.type + "-hand";
            })
            .attr("x1", 0)
            .attr("y1", function(d) {
                return d.balance ? d.balance : 0;
            })
            .attr("x2", 0)
            .attr("y2", function(d) {
                return d.length;
            })
            .attr("transform", function(d) {
                return "rotate(" + d.scale(d.value) + ")";
            });

        d3.select(".hour-hand").style("display", (config.analogDisplayHoursIndicator ? "block" : "none"));
        d3.select(".minute-hand").style("display", (config.analogDisplayMinutesIndicator ? "block" : "none"));
        d3.select(".second-hand").style("display", (config.analogDisplaySecondsIndicator ? "block" : "none"));
    };

    var moveHands = function() {
        d3.select("#clock-hands").selectAll("line")
            .data(handData)
            .transition()
            .attr("transform", function(d) {
                return "rotate(" + d.scale(d.value) + ")";
            });
    };

    var updateData = function() {
        var t = moment().tz(config.timezone);
        handData[0].value = (t.hour() % 12) + t.minutes() / 60;
        handData[1].value = t.minutes();
        handData[2].value = t.seconds();
    };

    var refresh = setInterval(function() {
        updateData();
        moveHands();
    }, config.refreshInterval);

    var redrawClock = function() {
        clearInterval(refresh);
        d3.select("#analogClock").html("");
        drawClock();
        refresh = setInterval(function() {
            updateData();
            moveHands();
        }, config.refreshInterval);
    };

    window.redrawClock = redrawClock;

    drawClock();
})();