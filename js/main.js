var config = {
    "refreshInterval": 1000,
    "showAnalog": true,
    "showDigital": true,
    "24hour": false,
    "displayMinutes": true,
    "displaySeconds": true,
    "displayMilliseconds": false,
    "timezone": "Europe/Warsaw"
};

(function() {
    var analogEl = document.getElementById("analogClock");
    var digitalEl = document.getElementById("digitalClock");
    var settingsModalEl = document.getElementById("settingsModal");
    var settingsButtonEl = document.getElementById("settingsButton");
    var closeSettingsButtonEl = document.getElementById("closeSettingsButton");

    var showAnalogCheckEl = document.getElementById("showAnalogCheck");
    var showDigitalCheckEl = document.getElementById("showDigitalCheck");
    var dig24hClockCheckEl = document.getElementById("dig24hClockCheck");
    var digShowMinutesCheckEl = document.getElementById("digShowMinutesCheck");
    var digShowSecondsCheckEl = document.getElementById("digShowSecondsCheck");
    var digShowMilliCheckEl = document.getElementById("digShowMilliCheck");
    var refreshIntervalEl = document.getElementById("refreshInterval");
    var timezoneEl = document.getElementById("timezone");

    var hoursEl = document.getElementById("hours");
    var minutesEl = document.getElementById("minutes");
    var secondsEl = document.getElementById("seconds");
    var millisecondsEl = document.getElementById("milliseconds");
    var hourTypeEl = document.getElementById("hourType");

    var yearEl = document.getElementById("dateYear");
    var monthEl = document.getElementById("dateMonth");
    var dayEl = document.getElementById("dateDay");
    var dayNameEl = document.getElementById("dateDayName");

    CoolClock.findAndCreateClocks();

    var changeHours = function(hours) {
        hoursEl.textContent = (hours === "" ? "" : hours);
    };

    var changeMinutes = function(minutes) {
        minutesEl.textContent = (minutes === "" ? "" : ": " + minutes);
    };

    var changeSeconds = function(seconds) {
        secondsEl.textContent = (seconds === "" ? "" : ": " + seconds);
    };

    var changeMilliseconds = function(milliseconds) {
        millisecondsEl.textContent = (milliseconds === "" ? "" : ": " + milliseconds);
    };

    var changeHourType = function(type) {
        hourTypeEl.textContent = type;
    };

    var changeYear = function(year) {
        yearEl.textContent = year;
    };

    var changeMonth = function(month) {
        monthEl.textContent = month;
    };

    var changeDay = function(day) {
        dayEl.textContent = day;
    };

    var changeDayName = function(dayName) {
        dayNameEl.textContent = dayName;
    };

    var changeTime = function() {
        var currTime = getCurrTime();

        var hours = config["24hour"] ? currTime.format("HH") : currTime.format("hh");
        var minutes = config.displayMinutes ? currTime.format("mm") : "";
        var seconds = config.displaySeconds ? currTime.format("ss") : "";
        var milliseconds = config.displayMilliseconds ? currTime.format("SSS") : "";
        var year = currTime.format("YYYY");
        var month = currTime.format("MM");
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
        config.showAnalog ? (analogEl.style.display = "block") : (analogEl.style.display = "none"); 
        config.showDigital ? (digitalEl.style.setProperty("display", "inline-block", "important")) : (digitalEl.style.setProperty("display", "none", "important"));
    };

    settingsButtonEl.onclick = function() {
        (new Modal(settingsModalEl)).show();
    };

    closeSettingsButtonEl.onclick = function() {
        config.showAnalog = showAnalogCheckEl.checked;
        config.showDigital = showDigitalCheckEl.checked;
        config["24hour"] = dig24hClockCheckEl.checked;
        config.displayMinutes = digShowMinutesCheckEl.checked;
        config.displaySeconds = digShowSecondsCheckEl.checked;
        config.displayMilliseconds = digShowMilliCheckEl.checked;
        config.refreshInterval = refreshIntervalEl.value ? parseInt(refreshIntervalEl.value) : 100;
        config.timezone = timezoneEl.value;

        saveSettings();
        updateView();
    };

    var loadSettings = function() {
        if(localStorage.getItem("config")) {
            var savedConfig = JSON.parse(localStorage.getItem("config"));
            Object.keys(savedConfig).map(function(key) {
                config[key] = savedConfig[key];
            });
        }

        showAnalogCheckEl.checked = config.showAnalog;
        showDigitalCheckEl.checked = config.showDigital;
        dig24hClockCheckEl.checked = config["24hour"];
        digShowMinutesCheckEl.checked = config.displayMinutes;
        digShowSecondsCheckEl.checked = config.displaySeconds;
        digShowMilliCheckEl.checked = config.displayMilliseconds;
        refreshIntervalEl.value = config.refreshInterval;
        timezoneEl.value = config.timezone;
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
        timezoneEl.innerHTML = timezonesHtml;
    };

    loadTimezones();
    loadSettings();
    updateView();
    
    setTimeout(function updateTime() {
        changeTime();
        setTimeout(updateTime, config.refreshInterval);
    }, 0);
})();