import Sapper from '../src/js/Sapper';

describe('Sapper', () => {
    let sapper;

    beforeEach(() => {
        sapper = new Sapper({
            totalMines: 10,
            fieldWidth: 10,
            fieldHeight: 10,
            fieldSelector: '#field',
            timerSelector: '#timer',
            movesSelector: '#moves'
        });
    });

    test('createFieldMatrix – создание матрицы игрового поля', () => {
        sapper.createFieldMatrix();
        expect(sapper.fieldMatrix.length).toBe(10);
        expect(sapper.fieldMatrix[0].length).toBe(10);
        expect(sapper.fieldMatrix.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('generateMines – создание мин', () => {
        sapper.generateMines();
        expect(sapper.mines.length).toBe(10);
        sapper.mines.forEach(([x, y]) => {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(10);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThan(10);
        });
    });

    test('placeMinesAndHints – расстановка мин и подсказок', () => {
        sapper.mines = [[1, 1], [3, 3]];
        sapper.createFieldMatrix();
        sapper.placeMinesAndHints();
        expect(sapper.fieldMatrix[1][1]).toBe('*');
        expect(sapper.fieldMatrix[3][3]).toBe('*');
        expect(sapper.fieldMatrix[0][0]).toBe(1);
        expect(sapper.fieldMatrix[2][2]).toBe(2);
    });

    test('findAllEmptyCells – поиск всех соседних пустых ячеек', () => {
        const testMatrix = [
            [0, 1, 0],
            [1, 0, 1],
            [0, 1, 0]
        ];
        const emptyCells = sapper.findAllEmptyCells(testMatrix, 1, 1);
        // Сортируем результат, чтобы порядок не имел значения
        const sortedEmptyCells = emptyCells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        expect(sortedEmptyCells).toEqual([[1, 1]]);
    });

    test('checkWin – проверка на победу', () => {
        // TODO
    });
});