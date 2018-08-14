$('.grid-row').each(function (index, elem) {
    $(elem).prop('id', 'row' + index);
});

var statesHistory = [];
var LOCAL_STORAGE_KEY_FOR_HISTORY = 'history';
var LOCAL_STORAGE_KEY_FOR_MAX_SCORE = 'maxScore';
var n = 4;
var CHANCE_FOR_4_TO_SPAWN = 10;
var stateSurfingIndex;
var isStateSurfingUsed = false;

function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

function checkFreeCells() {
    var cells = $('.grid-cell');
    var hasFreeCells = false;
    cells.each(function (index, elem) {
        if ($(elem).text() === '')
            hasFreeCells = true;
    });
    return hasFreeCells;
};

function cellSpawn() {
    var cells = $('.grid-cell');
    var hasFreeCells = checkFreeCells();
    var freeCellsIndexes = [];
    var randomPosForSpawn;
    if (hasFreeCells) {
        cells.each(function (index, elem) {
            if ($(elem).text() === '')
                freeCellsIndexes.push(index);
        });
    }
    randomPosForSpawn = freeCellsIndexes[getRandomInteger(0, freeCellsIndexes.length - 1)];

    let val = 2;
    // probability for spawning 4 instead of 2 is 10%
    if (getRandomInteger(0, 100) < CHANCE_FOR_4_TO_SPAWN) { val = val * 2 };
    $(cells[randomPosForSpawn]).text(val);
    return randomPosForSpawn
};

function getStateToArray() {
    var array = new Array(n);
    for (let i = 0; i < n; i++) {
        array[i] = new Array(n);
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            array[i][j] = $('div[data-id =' + i + j + ']').text();
        }
    }
    return array;
}

function createHistoryObject() {
    var date = new Date();
    var state = getStateToArray();
    return {
        date,
        state
    }
}

function addToHistory() {
    var history = createHistoryObject();
    statesHistory.push(history);
}

function stateWasChanged() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ($('div[data-id =' + i + j + ']').text() !== statesHistory[statesHistory.length - 1].state[i][j]) {
                return true;
            }
        }
    }
    return false;
}

function addToLocalStorage() {
    var str = JSON.stringify(statesHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY_FOR_HISTORY, str);

}

function getHistoryFromLocalStorage() {
    var newHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FOR_HISTORY));
    return newHistory;

}

function getStateFromLocalStorage(i) {
    var newHistory = getHistoryFromLocalStorage();
    if ((i === undefined) || (newHistory[i] === undefined)) {
        var state = newHistory[newHistory.length - 1].state;
    }
    else {
        var state = newHistory[i].state;
    }
    return state;
}

function isDefeated() {
    if (checkFreeCells()) { return false };
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            var equalToLeft = $('div[data-id =' + i + j + ']').text() === $('div[data-id =' + (i - 1) + j + ']').text();
            var equalToRight = $('div[data-id =' + i + j + ']').text() === $('div[data-id =' + (i + 1) + j + ']').text();
            var equalToUpper = $('div[data-id =' + i + j + ']').text() === $('div[data-id =' + i + (j - 1) + ']').text();
            var equalToLower = $('div[data-id =' + i + j + ']').text() === $('div[data-id =' + i + (j + 1) + ']').text();
            if (equalToLeft || equalToLower || equalToRight || equalToUpper) {
                return false;
            }
        }
    }
    return true;
}

function isWinner() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ($('div[data-id =' + i + j + ']').text() === '2048') {
                var win = confirm('Поздравляем! Хотите продолжить игру?')
                if (!win) {
                    startGame();
                }
            }
        }
    }
}

function createScore() {
    $('.score').text('');
    $('.max-score').text(localStorage.getItem(LOCAL_STORAGE_KEY_FOR_MAX_SCORE));
}

function updateScore(val) {
    var score = +$('.score').text();
    var maxScore = +localStorage.getItem(LOCAL_STORAGE_KEY_FOR_MAX_SCORE);
    score += val;
    if (score > maxScore) {
        $('.max-score').text(score);
        localStorage.setItem(LOCAL_STORAGE_KEY_FOR_MAX_SCORE, score);
    }
    $('.score').text(score);

}

function moveRightOrDown(cell, area, j) {
    if ($(cell).text() === '') {
        return;
    }
    while (j <= 3) {
        var val = $(area[j]).text();
        var isNeighborChanged = ($(area[j + 1]).attr('data-changed') === '1');
        var isNeighborMergeable = ($(area[j + 1]).text() === $(area[j]).text());
        var isSelfMergeable = $(area[j]).attr('data-changed') !== '1';

        if ((area[j + 1]) && ($(area[j + 1]).text() === '')) {
            $(area[j + 1]).text(val);
            $(area[j]).text('');
            ++j;
            continue;
        }
        if (!isSelfMergeable) { ++j; continue }
        if ((area[j + 1]) && isNeighborMergeable && (!isNeighborChanged) && isSelfMergeable) {
            val = '' + val * 2;
            $(area[j + 1]).text(val);
            $(area[j + 1]).attr('data-changed', '1');
            $(area[j]).text('');
            updateScore(+val);
            ++j;
            continue;
        }
        ++j;
    }
}

function moveLeftOrUp(cell, area, j) {
    if ($(cell).text() === '') {
        return;
    }
    while (j >= 0) {
        var val = $(area[j]).text();
        var isNeighborChanged = ($(area[j - 1]).attr('data-changed') === '1');
        var isNeighborMergeable = ($(area[j - 1]).text() === $(area[j]).text());
        var isSelfMergeable = $(area[j]).attr('data-changed') !== '1';

        if ((area[j - 1]) && ($(area[j - 1]).text() === '')) {
            $(area[j - 1]).text(val);
            $(area[j]).text('');
            --j;
            continue;
        }
        if (!isSelfMergeable) { --j; continue }
        if ((area[j - 1]) && isNeighborMergeable && (!isNeighborChanged) && isSelfMergeable) {
            val = '' + val * 2;
            $(area[j - 1]).text(val);
            $(area[j - 1]).attr('data-changed', '1');
            $(area[j]).text('');
            updateScore(+val);
            --j;
            continue;
        }
        --j;
    }
}


function clearStateAfterMove() {
    $('.grid-cell').attr('data-changed', '0');
}

function startGame() {
    $('.grid-cell').each(function (index, elem) {
        $(elem).text('');
    });

    createScore();

    var newHistory = getHistoryFromLocalStorage();
    if (newHistory) {
        var state = getStateFromLocalStorage();
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                $('div[data-id =' + i + j + ']').text(state[i][j]);
            }
        }
        statesHistory = getHistoryFromLocalStorage();
    } else {
        statesHistory = [];
        cellSpawn();
        cellSpawn();
        addToHistory();
    }
}

$(document).ready(startGame());

$('body').keydown(function (e) {
    var cells = $('.grid-cell');
    switch (e.which) {
        case 40:        // down button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellCol = `${$(elem).data('id')}`[1];
                    var moveArea = $('div[data-id$=' + cellCol + ']');
                    for (let i = moveArea.length - 1; i >= 0; i--) {
                        moveRightOrDown(moveArea[i], moveArea, i);
                    }
                }
            });
            clearStateAfterMove();
            break;

        case 39:    //right button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellRow = `${$(elem).data('id')}`[0]
                    var moveArea = $('div[data-id^=' + cellRow + ']');
                    for (let i = moveArea.length - 1; i >= 0; i--) {
                        moveRightOrDown(moveArea[i], moveArea, i);
                    }
                }
            });
            clearStateAfterMove();
            break;

        case 38:        //up button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellCol = `${$(elem).data('id')}`[1];
                    var moveArea = $('div[data-id$=' + cellCol + ']');
                    for (let i = 0; i < moveArea.length; i++) {
                        moveLeftOrUp(moveArea[i], moveArea, i);
                    }
                }
            });
            clearStateAfterMove();
            break;

        case 37:        //left button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellRow = `${$(elem).data('id')}`[0]
                    var moveArea = $('div[data-id^=' + cellRow + ']');
                    for (let i = 0; i < moveArea.length; i++) {
                        moveLeftOrUp(moveArea[i], moveArea, i);
                    }
                }
            });
            clearStateAfterMove();
            break;

        default:
            break;
    }

    isWinner();
    if (isDefeated()) {
        var answer = confirm('Вы проиграли. Начать новую игру?')
        if (answer) {
            localStorage.removeItem(LOCAL_STORAGE_KEY_FOR_MAX_SCORE);
            startGame();
        }
    }

    if (stateWasChanged()) {
        cellSpawn();
    }

    if (isStateSurfingUsed) {
        statesHistory.splice(stateSurfingIndex + 1);
        isStateSurfingUsed = false;
    }

    addToHistory();
    addToLocalStorage();
    stateSurfingIndex = getHistoryFromLocalStorage().length - 2;
    $('#left-arrow').prop('disabled', false);
    $('#right-arrow').prop('disabled', true);
});

$('#new-game-button').click(function () {
    localStorage.removeItem(LOCAL_STORAGE_KEY_FOR_HISTORY);
    startGame();
})

$('#left-arrow').click(function () {
    var newHistory = getHistoryFromLocalStorage();
    $('#right-arrow').prop('disabled', false);
    if (stateSurfingIndex < 0) {
        var quest = confirm('Это последнее записанное состояние, вернуться к началу?')
        
        if (quest) {
            stateSurfingIndex = newHistory.length - 2;
        }
        else {
            $('#left-arrow').prop('disabled', true);
        }
    }

    if (stateSurfingIndex >= 0) {
        var state = getStateFromLocalStorage(stateSurfingIndex);

        $('.grid-cell').each(function (index, elem) {
            $(elem).text('');
        });
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                $('div[data-id =' + i + j + ']').text(state[i][j]);
            }
        }
        --stateSurfingIndex;
        isStateSurfingUsed = true;
    }
})

$('#right-arrow').click(function () {
    var newHistory = getHistoryFromLocalStorage();
    $('#left-arrow').prop('disabled', false);
    if (stateSurfingIndex < newHistory.length - 1) {
        var state = getStateFromLocalStorage(stateSurfingIndex + 2);

        $('.grid-cell').each(function (index, elem) {
            $(elem).text('');
        });
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                $('div[data-id =' + i + j + ']').text(state[i][j]);
            }
        }
        ++stateSurfingIndex;
    }

    if (stateSurfingIndex + 2 === newHistory.length) {
        $('#right-arrow').prop('disabled', true);
    }
})

