const birthdayInput = '1985-11-08';

window.addEventListener('load', function() { parseInput(); });

function parseInput() {
    /*
    There's a discrepency between actual weeks lived (weeksLived)
    and the proper number of weeks to show on the calendar (calendarWeeks).
    Possibly due to leap years. Said discrepency is greater for older folks.
    For example if my bday is 07-26-1990 and today is 07-26-2017,
    on the calendar it'll show that I'm already 5 weeks past my birthday.
    To make this more usable and human-oriented, the calendar will show
    the proper number of weeks since one's last birthday.
    This next choice is iffy, but the weeks text will display the actual
    number of weeks lived and weeks left
    */
    var birthDate = moment(birthdayInput);
    var today = moment();
    var yearsLived = today.diff(birthDate, 'years');
    var weeksLived = today.diff(birthDate, 'weeks');

    // If birthday is within a week, set calendar 'Today' to last week of previous age
    var lastBirthday = moment(birthDate.clone().add(yearsLived, 'y').format('YYYY-MM-DD'));
    var nextBirthday = moment(lastBirthday.clone().add(1, 'y'));
    var nextBirthdayWeekReference = nextBirthday.clone().subtract(7, 'days').startOf('day');
    var weeksSinceLastBirthday = today.diff(lastBirthday, 'weeks');
    if (today.isAfter(nextBirthdayWeekReference)) weeksSinceLastBirthday = 51;
    var calendarWeeks = (yearsLived * 52) + weeksSinceLastBirthday;

    // Check if today is birthday
    if (isBirthday(today, birthDate)) {
        document.getElementById('age').innerHTML = getOrdinal(yearsLived);
        document.getElementById('birthday-msg').className = '';
    } else {
        document.getElementById('birthday-msg').className = 'hidden';
    }

    document.getElementById('weeks-lived').innerHTML = weeksLived;
    document.getElementById('weeks-left').innerHTML = 5200 - weeksLived;

    document.getElementById('weeks-container').classList.remove('hidden');
    createCalendar(calendarWeeks, document.getElementById('year-switch').checked);
}

function createCalendar(calendarWeeks, yearView) {
    var weeksCalendar = document.getElementById('weeks-calendar');
    weeksCalendar.innerHTML = '';
    weeksCalendar.className = '';

    var yearCounter = 0;
    var weeksCounter = 0;
    weeksCalendar.className = yearView ? 'years-view' : 'default';

    for (i = 0; i < 100; i++) {
        var year = document.createElement('div');
        year.classList.add('year');
        if (yearView && yearCounter % 10 == 0) {
            var label = document.createElement('label');
            label.innerHTML = yearCounter;
            year.appendChild(label);
        }
        yearCounter++;

        for (j = 0; j < 52; j++) {
            var week = document.createElement('div');
            week.classList.add('week');
            if (weeksCounter < calendarWeeks) week.classList.add('lived');
            if (weeksCounter == calendarWeeks) {
                week.classList.add('today-container');
                var label = document.createElement('div');
                label.classList.add('today-label');
                var innerWeek = document.createElement('div');
                innerWeek.classList.add('today', 'week');
                week.appendChild(innerWeek);
                week.appendChild(label);
            }
            year.appendChild(week);
            weeksCounter++;
        }

        weeksCalendar.appendChild(year);
        doSetTimeout(i, year);
    }
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