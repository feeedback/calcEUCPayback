// *********************
// customRangeInput.js

const COUNT_LABELS_INPUT_RANGE_DATASET_OPTION = 6;

const createOptionForDatalist = (input) => {
    const datalist = document.querySelector(
        `.custom-range-wrapper #${input.getAttribute('list')}`
    );

    const min = Number(input.min);
    const max = Number(input.max);
    const step = Number(input.step);

    const roundStep = (num) => {
        const digits = String(step).split('.')[1]?.length ?? 0;
        return Number(num.toFixed(digits));
    };

    const roundLabelStep = roundStep(
        (max - min) / COUNT_LABELS_INPUT_RANGE_DATASET_OPTION
    );

    for (let i = min, li = min; i <= max; i = roundStep(i + step)) {
        const opt = document.createElement('option');

        // option scale
        opt.value = i;
        // option label
        if (i === li) {
            opt.label = i;
            li = roundStep(Math.round(roundStep(li + roundLabelStep) / step) * step);
            // Math.floor
        }
        datalist.appendChild(opt);
    }
};

const createDatalistForInputRange = (inputRange) => {
    const datalist = document.createElement('datalist');
    // eslint-disable-next-line no-param-reassign
    datalist.id = `datalist_${inputRange.id}`;
    inputRange.setAttribute('list', `datalist_${inputRange.id}`);
    inputRange.parentElement.appendChild(datalist);
};

const setFillClassForDatalistOption = (input) => {
    document
        .querySelector(`.custom-range-wrapper #${input.getAttribute('list')}`)
        .querySelectorAll('option')
        .forEach((option) => {
            if (Number(option.value) <= Number(input.value)) {
                option.classList.add('fill');
            } else {
                option.classList.remove('fill');
            }
        });
};

const setFillPercentClassForInputRangeTrack = (input) => {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);
    const fillPercent = Math.round(((value - min) * 100) / (max - min));
    const prevClassFillPercent = input.className
        .split(' ')
        .find((cl) => cl.includes('fill_percent'));
    input.classList.remove(prevClassFillPercent);
    input.classList.add(`fill_percent${fillPercent}`);
};

const setCurrentValueInOutput = (input) => {
    // eslint-disable-next-line no-param-reassign
    document.querySelector(`output[for="${input.id}"]`).value = input.value;
};

const customInputRangeInit = () => {
    const inputsRangeList = document.querySelectorAll(
        '.custom-range-wrapper input[type="range"]'
    );
    inputsRangeList.forEach(createDatalistForInputRange);
    inputsRangeList.forEach(createOptionForDatalist);
    inputsRangeList.forEach(setFillClassForDatalistOption);
    inputsRangeList.forEach(setFillPercentClassForInputRangeTrack);
    inputsRangeList.forEach(setCurrentValueInOutput);
};

const customInputRangeHandler = (event) => {
    const inputRange = event.target;
    setFillClassForDatalistOption(inputRange);
    setFillPercentClassForInputRangeTrack(inputRange);
    setCurrentValueInOutput(inputRange);
};

customInputRangeInit();
document
    .querySelectorAll('.custom-range-wrapper')
    .forEach((inputRange) =>
        inputRange.addEventListener('input', customInputRangeHandler)
    );
document
    .querySelectorAll('.custom-range-wrapper')
    .forEach((inputRange) =>
        inputRange.addEventListener('touchstart', (ev) =>
            ev.targetTouches[0].target.classList.add('focusOn')
        )
    );
document
    .querySelectorAll('.custom-range-wrapper')
    .forEach((inputRange) =>
        inputRange.addEventListener('touchend', (ev) =>
            ev.changedTouches[0].target.classList.remove('focusOn')
        )
    );
