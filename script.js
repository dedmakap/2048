// $(document).ready(function () {

$('.grid-row').each(function (index, elem) {
    $(elem).prop('id', 'row' + index);
});



function randomInteger(min, max) {
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
    randomPosForSpawn = freeCellsIndexes[randomInteger(0, freeCellsIndexes.length - 1)];


    $(cells[randomPosForSpawn]).text(2);
    return randomPosForSpawn

};

function getFreePlace(el, grid) {

};

$('body').keydown(function (e) {
    var cells = $('.grid-cell');
    switch (e.which) {
        case 40:        // down button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellCol = `${$(elem).data('id')}`[1];
                    var moveArea = $('div[data-id$=' + cellCol + ']');
                    for (let i = 0; i < moveArea.length; i++) {

                        if (($(moveArea[i]).text() !== '') && (moveArea[i + 1]) && ($(moveArea[i + 1]).text() === '')) {
                            var val = $(moveArea[i]).text();
                            $(moveArea[i + 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }
                        else if (($(moveArea[i]).text() !== '') && ($(moveArea[i]).text() === $(moveArea[i + 1]).text())) {
                            var val = $(moveArea[i]).text() * 2;
                            val = '' + val;
                            $(moveArea[i + 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }

                    }
                }



            });
            cellSpawn();
            break;

        case 39:        //right button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellRow = `${$(elem).data('id')}`[0]
                    var moveArea = $('div[data-id^=' + cellRow + ']');
                    for (let i = 0; i < moveArea.length; i++) {

                        if (($(moveArea[i]).text() !== '') && (moveArea[i + 1]) && ($(moveArea[i + 1]).text() === '')) {
                            var val = $(moveArea[i]).text();
                            $(moveArea[i + 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }

                        else if (($(moveArea[i]).text() !== '') && ($(moveArea[i]).text() === $(moveArea[i + 1]).text())) {
                            var val = $(moveArea[i]).text() * 2;
                            val = '' + val;
                            $(moveArea[i + 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }

                    }
                }

            });
            cellSpawn();
            break;

        case 38:        //up button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellCol = `${$(elem).data('id')}`[1];
                    var moveArea = $('div[data-id$=' + cellCol + ']');
                    for (let i = moveArea.length; i > 0; i--) {

                        if (($(moveArea[i]).text() !== '') && (moveArea[i - 1]) && ($(moveArea[i - 1]).text() === '')) {
                            var val = $(moveArea[i]).text();
                            $(moveArea[i - 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }

                        else if (($(moveArea[i]).text() !== '') && ($(moveArea[i]).text() === $(moveArea[i - 1]).text())) {
                            var val = $(moveArea[i]).text() * 2;
                            val = '' + val;
                            $(moveArea[i - 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }

                    }
                }



            });
            cellSpawn();
            break;
        case 37:        //left button
            cells.each(function (index, elem) {
                if ($(elem).text() !== '') {
                    var cellRow = `${$(elem).data('id')}`[0]
                    var moveArea = $('div[data-id^=' + cellRow + ']');
                    for (let i = moveArea.length; i > 0; i--) {

                        if (($(moveArea[i]).text() !== '') && (moveArea[i - 1]) && ($(moveArea[i - 1]).text() === '')) {
                            var val = $(moveArea[i]).text();
                            $(moveArea[i - 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }
                        else if (($(moveArea[i]).text() !== '') && ($(moveArea[i]).text() === $(moveArea[i - 1]).text())) {
                            var val = $(moveArea[i]).text() * 2;
                            val = '' + val;
                            $(moveArea[i - 1]).text(val);
                            $(moveArea[i]).text('');
                            continue;
                        }

                    }
                }

            });
            cellSpawn();
            break;

        default:
            cellSpawn();
            break;
    }

});

// })
