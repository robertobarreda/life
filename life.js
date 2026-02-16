const birthday = '1985-11-08';
const totalYears = 90;

window.addEventListener('load', () => {
    setupUnitSelector();
    repaint();
});

function setupUnitSelector() {
    const display = document.getElementById('unit-display');
    const options = document.getElementById('unit-options');
    const optionButtons = document.querySelectorAll('.unit-option');

    function updateSelectedUnit() {
        const activeButton = document.querySelector('.unit-option.active');
        display.textContent = activeButton.getAttribute('data-unit');
    }

    updateSelectedUnit();

    display.addEventListener('click', (e) => {
        e.stopPropagation();
        options.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        options.classList.add('hidden');
    });

    options.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    optionButtons.forEach((button) => {
        button.addEventListener('click', function() {
            optionButtons.forEach((btn) => btn.classList.remove('active'));
            this.classList.add('active');
            updateSelectedUnit();
            options.classList.add('hidden');
            repaint();
        });
    });
}

function repaint() {
    const unit = getActiveUnit();
    const birthDate = getBirthDate();
    const current = calculateElapsedTime(unit, birthDate);
    const total = calculateTotalTime(unit, birthDate);

    renderChart(current, total, unit);
    updateLivedCounter(current);
    updateBirthdayMessage(birthDate);
}

function calculateElapsedTime(unit, birthDate) {
    return moment().diff(birthDate, unit);
}

function calculateTotalTime(unit, birthDate) {
    const futureDate = moment(birthDate).add(totalYears, 'years');
    return futureDate.diff(birthDate, unit);
}

function renderChart(current, total, unit) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
        const el = document.createElement('li');
        if (i < current) el.classList.add('done');

        if (unit === 'weeks' && Math.floor(i / 52) % 4 === 3) {
            el.classList.add('row-gap');
        }

        fragment.appendChild(el);
    }

    const container = document.getElementById('chart');
    container.replaceChildren(fragment);
    container.className = `chart ${unit}`;
}

function updateLivedCounter(current) {
    document.getElementById('lived').textContent = current;
}

function updateBirthdayMessage(birthDate) {
    const today = moment();
    const birthdayMsg = document.getElementById('birthday-msg');

    if (isBirthday(today, birthDate)) {
        document.getElementById('age').textContent = getOrdinal(today.diff(birthDate, 'years'));
        birthdayMsg.classList.remove('hidden');
    } else {
        birthdayMsg.classList.add('hidden');
    }
}

function getOrdinal(n) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function getBirthDate() {
    return moment(window.location.hash.substring(1) || birthday);
}

function isBirthday(m1, m2) {
    return m1.date() === m2.date() && m1.month() === m2.month();
}

function getActiveUnit() {
    return document.querySelector('.unit-option.active').getAttribute('data-unit');
}
