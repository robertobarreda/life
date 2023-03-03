const birthday = '1985-11-08';
const totalYears = 90;

window.addEventListener('load', function() {
    document.getElementById("unitbox").setAttribute("onchange", "repaint()");
    repaint();
});

function repaint() {
    _repaintItems(calculateElapsedTime(), calculateTotalTime());
}

function calculateElapsedTime() {
    var unitText = _viewMode();
    var birthDate = moment(birthday);
    var today = moment();
    var yearsLived = today.diff(birthDate, 'years');

    switch (unitText) {
      case 'weeks':
        // Measuring weeks is tricky since our chart shows 52 weeks per year (for simplicity)
        // when the actual number of weeks per year is 52.143. Attempting to calculate weeks
        // with a diffing strategy will result in build-up over time. Instead, we'll add up
        // 52 per elapsed full year, and only diff the weeks on the current partial year.
        var lastBirthday = moment(birthDate.clone().add(yearsLived, 'y').format('YYYY-MM-DD'));
        var nextBirthday = moment(lastBirthday.clone().add(1, 'y'));
        var nextBirthdayWeekReference = nextBirthday.clone().subtract(7, 'days').startOf('day');
        var weeksSinceLastBirthday = today.diff(lastBirthday, 'weeks');
        if (today.isAfter(nextBirthdayWeekReference)) weeksSinceLastBirthday = 51;
        return (yearsLived * 52) + weeksSinceLastBirthday;
      case 'months':
        // Months are tricky, being variable length, so I opted for the average number
        // of days in a month as a close-enough approximation (30.4375). This can make
        // the chart look off by a day when you're right on the month threshold, but
        // it's otherwise fairly accurate over long periods of time.
        return today.diff(birthDate, 'months');
      case 'years':
        // We can represent our millisecond diff as a year and subtract 1970 to
        // end up with an accurate elapsed time. To see why, consider the following:
        //
        //   1. JavaScript's Date timestamp represents milliseconds since 1970. Thus,
        //      new Date(0).toUTCString() → 'Thu, 01 Jan 1970 00:00:00 GMT'
        //   2. Picture the diff between today and tomorrow. It's a small number. A
        //      newly created date with that number would result in January 2 1970.
        //   3. Thus, subtracting 1970 from that date gives us elapsed time. We use
        //      UTC because otherwise we'd need to offset "1970" by our timezone.
        //
        // See more details here: https://stackoverflow.com/a/24181701/1154642
        return yearsLived;
    }
}

function calculateTotalTime() {
    var unitText = _viewMode();

    switch (unitText) {
      case 'weeks':
        return (totalYears * 52);
      case 'months':
        return (totalYears * 12);
      case 'years':
        return totalYears;
    }
}

function _repaintItems(current, total) {
    var elements = []
    for (var i = 0; i < total; i++) {
        var el = document.createElement('li');
        if (i < current) el.classList.add("done");
        elements.push(el);
    }

    var container = document.getElementById('chart');
    container.replaceChildren(...elements);
    container.classList.remove("years", "months", "weeks");
    container.classList.add(_viewMode());
}

function _viewMode() {
    return document.querySelector('.unitbox').value.toLowerCase();
}

function doSetTimeout(i, element) {
    setTimeout(function(){
      element.classList.add('fadeIn');
    }, (i*16) + (i*i/6));
}

function isBirthday(m1, m2){
    return m1.date() === m2 .date() && m1.month() === m2.month()
}

var getOrdinal = function(n) {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}