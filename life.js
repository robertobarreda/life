const timeout = setTimeout(() => {
	const val = '1993-01-02';
	birthdayInput.value = val;
	parseInput(val);
	$('html, body').animate({
		scrollTop: weeksCalendar.offsetTop - 10
		},
		500
	);
}, 1250);


document.addEventListener('mousemove', removeDemo);
document.addEventListener('click', removeDemo);

function removeDemo() {
	clearTimeout(timeout);
	document.removeEventListener('mousemove', removeDemo);
	document.removeEventListener('click', removeDemo);
	console.log('clear');
}


// 7-26-17
var birthdayInput = document.getElementById('bday');
var yearSwitchEl = document.getElementById('year-switch');
var submitBtn = document.getElementById('submit');
var weeksCalendar = document.getElementById('weeks-calendar');
onDocumentLoad();

function onDocumentLoad() {
	var birthdayValue = getCookie('birthday');
	if (birthdayValue) birthdayInput.value = birthdayValue;
	checkInput();
}

var today = new Date();
var expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days

function setCookie(name, value) {
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
	console.log('cookie', document.cookie);
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function checkInput() {
	if (birthdayInput.value) submitBtn.disabled = false;
	else submitBtn.disabled = true;
}

function parseInput() {
	// There's a discrepency between actual weeks lived (weeksLived) and the proper number of weeks to show on the calendar (calendarWeeks. Possibly due to leap years. Said discrepency is greater for older folks. For example if my bday is 07-26-1990 and today is 07-26-2017, on the calendar it'll show that I'm already 5 weeks past my birthday.
	// To make this more usable and human-oriented, the calendar will show the proper number of weeks since one's last birthday. This next choice is iffy, but the weeks text will display the actual number of weeks lived and weeks left
	setCookie("birthday", birthdayInput.value);

	console.log(birthdayInput.value)

	var birthDate = moment(birthdayInput.value);
	var today = moment();
	var yearsLived = today.diff(birthDate, 'years');
	var weeksLived = today.diff(birthDate, 'weeks');

	// If birthday is within a week, set calendar 'Today' to last week of previous age
	var lastBirthday = moment(birthDate.clone().add(yearsLived, 'y').format('YYYY-MM-DD'));
	var nextBirthday = moment(lastBirthday.clone().add(1, 'y'));
	var nextBirthdayWeekReference = nextBirthday.clone().subtract(7, 'days').startOf('day');
	var weeksSinceLastBirthday = today.diff(lastBirthday, 'weeks');
	if (today.isAfter(nextBirthdayWeekReference))  weeksSinceLastBirthday = 51;
	var calendarWeeks = (yearsLived*52) + weeksSinceLastBirthday;

	//Check if today is birthday
	var birthMonthDay = birthDate.format('MM-DD');
	var todayMonthDay = moment(today.format('MM-DD'));
	if (todayMonthDay.isSame(birthMonthDay)) {
		document.getElementById('age').innerHTML = getOrdinal(yearsLived);
		document.getElementById('birthday-msg').className = '';
	} else {
		document.getElementById('birthday-msg').className = 'hidden';
	}

	document.getElementById('weeks-lived').innerHTML = weeksLived;
	document.getElementById('weeks-left').innerHTML = 5200 - weeksLived;

	document.getElementById('weeks-container').classList.remove('hidden');
	createCalendar(calendarWeeks, yearSwitchEl.checked);
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

function arrangeByYear() {
	parseInput();
}

var getOrdinal = function(n) {
	var s=["th","st","nd","rd"],
	v=n%100;
	return n+(s[(v-20)%10]||s[v]||s[0]);
}