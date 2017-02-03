(function() {
    var analogEl = d3.select("#analogClock");
    var digitalEl = d3.select("#digitalClock");
    var settingsModalEl = d3.select("#settingsModal");
    var settingsButtonEl = d3.select("#settingsButton");
    var closeSettingsButtonEl = d3.select("#closeSettingsButton");

    var showAnalogCheckEl = d3.select("#showAnalogCheck");
    var showDigitalCheckEl = d3.select("#showDigitalCheck");
    var dig24hClockCheckEl = d3.select("#dig24hClockCheck");
    var digShowMinutesCheckEl = d3.select("#digShowMinutesCheck");
    var digShowSecondsCheckEl = d3.select("#digShowSecondsCheck");
    var digShowMilliCheckEl = d3.select("#digShowMilliCheck");
    var anShowHoursIndiCheckEl = d3.select("#anShowHoursIndiCheck");
    var anShowMinutesIndiCheckEl = d3.select("#anShowMinutesIndiCheck");
    var anShowSecondsIndiCheckEl = d3.select("#anShowSecondsIndiCheck");
    var anShowHoursMarksCheckEl = d3.select("#anShowHoursMarksCheck");
    var anShowSecondsMarksCheckEl = d3.select("#anShowSecondsMarksCheck");
    var romanNumeralsCheckEl = d3.select("#romanNumeralsCheck");

    var refreshIntervalEl = d3.select("#refreshInterval");
    var timezoneEl = d3.select("#timezone");

    var hoursEl = d3.select("#hours");
    var minutesEl = d3.select("#minutes");
    var secondsEl = d3.select("#seconds");
    var millisecondsEl = d3.select("#milliseconds");
    var hourTypeEl = d3.select("#hourType");

    var yearEl = d3.select("#dateYear");
    var monthEl = d3.select("#dateMonth");
    var dayEl = d3.select("#dateDay");
    var dayNameEl = d3.select("#dateDayName");

    var changeHours = function(hours) {
        var text = (hours === "" ? "" : hours);
        hoursEl.text(text);
    };

    var changeMinutes = function(minutes) {
        var text = (minutes === "" ? "" : ": " + minutes);
        minutesEl.text(text);
    };

    var changeSeconds = function(seconds) {
        var text = (seconds === "" ? "" : ": " + seconds);
        secondsEl.text(text);
    };

    var changeMilliseconds = function(milliseconds) {
        var text = (milliseconds === "" ? "" : ": " + milliseconds);
        millisecondsEl.text(text);
    };

    var changeHourType = function(type) {
        var text = type;
        hourTypeEl.text(text);
    };

    var changeYear = function(year) {
        var text = year;
        yearEl.text(text);
    };

    var changeMonth = function(month) {
        var text = month;
        monthEl.text(text);
    };

    var changeDay = function(day) {
        var text = day;
        dayEl.text(text);
    };

    var changeDayName = function(dayName) {
        var text = dayName;
        dayNameEl.text(text);
    };

    var changeTime = function() {
        var currTime = getCurrTime();

        var hours = config["24hour"] ? currTime.format("HH") : currTime.format("hh");
        var minutes = config.displayMinutes ? currTime.format("mm") : "";
        var seconds = config.displaySeconds ? currTime.format("ss") : "";
        var milliseconds = config.displayMilliseconds ? currTime.format("SSS") : "";
        var year = currTime.format("YYYY");
        var month = currTime.format("MMM");
        var day = currTime.format("DD");
        var dayName = currTime.format("dddd");

        changeHours(hours);
        changeMinutes(minutes);
        changeSeconds(seconds);
        changeMilliseconds(milliseconds);
        var tag = parseInt(currTime.format("HH")) < 12 ? "AM" : "PM";
        config["24hour"] ? changeHourType("") : changeHourType(tag);
        changeYear(year);
        changeMonth(month);
        changeDay(day);
        changeDayName(dayName);
    };

    var getCurrTime = function() {
        return moment().tz(config.timezone);
    };

    var updateView = function() {
        analogEl.style("display", (config.showAnalog ? "block" : "none"));
        digitalEl.style("display", (config.showDigital ? "inline-block" : "none"), "important");
        redrawClock();
    };

    settingsButtonEl.on("click", function() {
        (new Modal(settingsModalEl.node())).show();
    });

    closeSettingsButtonEl.on("click", function() {
        config.showAnalog = showAnalogCheckEl.property("checked");
        config.showDigital = showDigitalCheckEl.property("checked");
        config["24hour"] = dig24hClockCheckEl.property("checked");
        config.displayMinutes = digShowMinutesCheckEl.property("checked");
        config.displaySeconds = digShowSecondsCheckEl.property("checked");
        config.displayMilliseconds = digShowMilliCheckEl.property("checked");
        config.analogDisplayHoursIndicator = anShowHoursIndiCheckEl.property("checked");
        config.analogDisplayMinutesIndicator = anShowMinutesIndiCheckEl.property("checked");
        config.analogDisplaySecondsIndicator = anShowSecondsIndiCheckEl.property("checked");
        config.analogDisplayHoursMarks = anShowHoursMarksCheckEl.property("checked");
        config.analogDisplaySecondsMarks = anShowSecondsMarksCheckEl.property("checked");
        config.refreshInterval = refreshIntervalEl.property("value") ? parseInt(refreshIntervalEl.property("value")) : 100;
        config.timezone = timezoneEl.property("value");
        config.romanize = romanNumeralsCheckEl.property("checked");

        saveSettings();
        updateView();
    });

    var loadSettings = function() {
        if(localStorage.getItem("config")) {
            var savedConfig = JSON.parse(localStorage.getItem("config"));
            Object.keys(savedConfig).map(function(key) {
                config[key] = savedConfig[key];
            });
        }

        showAnalogCheckEl.property("checked", config.showAnalog);
        showDigitalCheckEl.property("checked", config.showDigital);
        dig24hClockCheckEl.property("checked", config["24hour"]);
        digShowMinutesCheckEl.property("checked", config.displayMinutes);
        digShowSecondsCheckEl.property("checked", config.displaySeconds);
        digShowMilliCheckEl.property("checked", config.displayMilliseconds);
        anShowHoursIndiCheckEl.property("checked", config.analogDisplayHoursIndicator);
        anShowMinutesIndiCheckEl.property("checked", config.analogDisplayMinutesIndicator);
        anShowSecondsIndiCheckEl.property("checked", config.analogDisplaySecondsIndicator);
        anShowHoursMarksCheckEl.property("checked", config.analogDisplayHoursMarks);
        anShowSecondsMarksCheckEl.property("checked", config.analogDisplaySecondsMarks);
        refreshIntervalEl.property("value", config.refreshInterval);
        timezoneEl.property("value", config.timezone);
        romanNumeralsCheckEl.property("checked", config.romanize);
    };

    var saveSettings = function() {
        localStorage.setItem("config", JSON.stringify(config));
    };

    var loadTimezones = function() {
        var timezonesHtml = "";
        moment.tz.names().map(function(name) {
            var tzOption = "<option value='" + name + "'>" + name + "</option>";
            timezonesHtml += tzOption;
        });
        timezoneEl.html(timezonesHtml);
    };

    loadTimezones();
    loadSettings();
    updateView();

    setTimeout(function updateTime() {
        changeTime();
        setTimeout(updateTime, config.refreshInterval);
    }, 0);
})();