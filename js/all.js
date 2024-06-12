const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}
// 新增欄位
addEntryButton.addEventListener('click', () => {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString =
    `
    <label for="name-${entryNumber}">名稱</label>
    <input type="text" id="name-${entryNumber}" placeholder="名稱" />
    <label for="calories-${entryNumber}">數字</label>
    <input
    type="number"
    min="0"
    id="calories-${entryNumber}"
    placeholder="卡路里"/>
    `;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
});

// 欄位熱量加總
function getCaloriesFromInputs(list) {
    let calories = 0;

    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

// 計算和顯示一日攝取熱量
calorieCounter.addEventListener('submit', (e)=>{
    e.preventDefault();
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? '盈餘' : '赤字';
    const cssClass = remainingCalories < 0 ? 'deficit' : 'surplus';
    output.innerHTML =
        `
    <p>所需的熱量 ${budgetCalories} 卡路里 </p>
    <p>攝取的熱量 ${consumedCalories} 卡路里</p>
    <p>燃燒的熱量 ${exerciseCalories} 卡路里</p>
    <hr>
    <span class="${cssClass}">${Math.abs(remainingCalories)} 熱量${surplusOrDeficit}</span>
    `;

    output.classList.remove('hide');
});

//清除欄位
clearButton.addEventListener('click', () => {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));

    for (const container of inputContainers) {
        container.innerHTML = '';
    }

    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
});