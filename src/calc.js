// calc.js

// TODO: Добавить пресеты, типа город-колесо
/* example presets:
Moscow, InMotion V10
15km job, 10km shop, electricity price - 5.4 day, 1.5 night, bus price - 50rub, 45km, 650kwh, 67000 rub

Tyumen, NineBot One S2
8km job, 5km shop, electricity price - 2.1 day, 1.0 night, bus price - 26rub, 25km, 310kwh, 33000 rub

Tyumen, InMotion  V10
8km job, 5km shop, electricity price - 2.1 day, 1.0 night, bus price - 26rub, 45km, 650kwh, 67000 rub

Tyumen, Gotway Tesla V2 
8km job, 5km shop, electricity price - 2.1 day, 1.0 night, bus price - 26rub, 70km, 1020kwh, 87000 rub
*/
const fnOutputsMap = {
  busCostsMonthly: ({ tripsToWorkPerMonth, tripsToStorePerMonth, busPrice }) =>
    (tripsToWorkPerMonth + tripsToStorePerMonth) * 2 * busPrice,
  mileagePerMonth: ({ tripsToWorkPerMonth, distanceToWork, tripsToStorePerMonth, distanceToStore }) =>
    (tripsToWorkPerMonth * distanceToWork + tripsToStorePerMonth * distanceToStore) * 2,
  EUCCostsMonthly: ({
    mileagePerMonth,
    priceOfElectricityDay,
    priceOfElectricityNight,
    shareOfDaytimeFromAll,
    batteryCapacityEUC,
    cruisingRangeEUC,
  }) =>
    (
      mileagePerMonth *
      (batteryCapacityEUC / cruisingRangeEUC / 1000) *
      (priceOfElectricityDay * shareOfDaytimeFromAll + priceOfElectricityNight * (1 - shareOfDaytimeFromAll))
    ).toFixed(1),
  savingsOnTripsPerMonth: ({ busCostsMonthly, EUCCostsMonthly }) =>
    (busCostsMonthly - EUCCostsMonthly).toFixed(0),
  busCostsPerYear: ({ busCostsMonthly }) => busCostsMonthly * 12,
  EUCCostsPerYear: ({
    EUCCostsMonthly,
    busCostsMonthly,
    monthsOfTheYearAreSuitableForEUC,
    maintenanceEUCCostPerYear,
  }) =>
    (
      EUCCostsMonthly * monthsOfTheYearAreSuitableForEUC +
      busCostsMonthly * (12 - monthsOfTheYearAreSuitableForEUC) +
      maintenanceEUCCostPerYear
    ).toFixed(0),
  savingsOnTripsPerYear: ({ busCostsPerYear, EUCCostsPerYear }) =>
    (busCostsPerYear - EUCCostsPerYear).toFixed(0),
  paybackEUC: ({ purchasePriceEUC, savingsOnTripsPerYear }) =>
    ((purchasePriceEUC * 1000) / savingsOnTripsPerYear).toFixed(1),
};

const calculateAndSetOutputValue = (input) => {
  const formEls = input.form.elements;
  const objInputsValues = () =>
    Object.fromEntries(Object.values(formEls).map((inputEl) => [inputEl.name, Number(inputEl.value)]));

  Object.keys(fnOutputsMap).forEach(
    // eslint-disable-next-line no-return-assign
    (output) => (formEls[output].value = fnOutputsMap[output](objInputsValues()))
  );
};

const calculateInputHandler = (event) => {
  const inputRange = event.target;
  calculateAndSetOutputValue(inputRange);
};
const calculateInputInit = () => {
  const inputRange = document.querySelector('input[type="range"]');
  calculateAndSetOutputValue(inputRange);
};
calculateInputInit();
document.querySelector('form[name="calc"]').addEventListener('input', calculateInputHandler);
