// *********************
// customRangeInput.js

const COUNT_LABELS_INPUT_RANGE_DATASET_OPTION = 6;

const createOptionForDatalist = (datalist) => {
    const inputRange = document.querySelector(
        `input[type="range"][list="${datalist.id}"`
    );

    const roundStep = (num) => {
        const digits = String(inputRange.step).split('.')[1]?.length ?? 0;
        return Number(num.toFixed(digits));
    };
    const min = Number(inputRange.min);
    const max = Number(inputRange.max);
    const step = Number(inputRange.step);

    const roundLabelStep = Number(
        roundStep((max - min) / COUNT_LABELS_INPUT_RANGE_DATASET_OPTION)
    );

    for (let i = min, li = min; i <= max; i = roundStep(i + step)) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.className = 'custom-range';

        if (i === li) {
            opt.label = i;
            li = roundStep(Math.round(roundStep(li + roundLabelStep) / step) * step);
            // Math.floor
        }
        datalist.appendChild(opt);
    }
};
const createOptionForDatalistAllInput = (form) => {
    form.querySelectorAll('datalist').forEach((datalist) =>
        createOptionForDatalist(datalist)
    );
};
const setFillClassForDatalistOption = (input) => {
    input.list.querySelectorAll('option').forEach((option) => {
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

const setCurrentValueInInputRangeTitle = (input) => {
    // eslint-disable-next-line no-param-reassign
    input.title = input.value;
};

const customInputRangeInit = () => {
    const { form } = document.querySelector('input[type="range"].custom-range');
    createOptionForDatalistAllInput(form);
    form.querySelectorAll('input[type="range"].custom-range').forEach(
        setFillClassForDatalistOption
    );
    form.querySelectorAll('input[type="range"].custom-range').forEach(
        setCurrentValueInOutput
    );
    form.querySelectorAll('input[type="range"].custom-range').forEach(
        setFillPercentClassForInputRangeTrack
    );
    // setCurrentValueInInputRangeTitle(inputRange);
};

const customInputRangeHandler = (event) => {
    const inputRange = event.target;
    setFillClassForDatalistOption(inputRange);
    setCurrentValueInOutput(inputRange);
    // setCurrentValueInInputRangeTitle(inputRange);
    setFillPercentClassForInputRangeTrack(inputRange);
};

customInputRangeInit();
document
    .querySelector('form[name="calc"]')
    .addEventListener('input', customInputRangeHandler);
