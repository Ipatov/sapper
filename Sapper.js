class Sapper {
    constructor(settings) {
        // Инициализация настроек и переменных
        this.settings = settings;
        this.fieldDIV = document.querySelector(settings.fieldSelector);
        this.totalMines = settings.totalMines;
        this.fieldWidth = settings.fieldWidth;
        this.fieldHeight = settings.fieldHeight;
        this.isGameActive = true;
        this.mines = [];
        this.fieldMatrix = [];
        this.timer = 0;
        this.moves = 0;
        this.timerElement = document.querySelector(settings.timerSelector);
        this.movesElement = document.querySelector(settings.movesSelector);
        this.timerInterval = null;

        // Картинки
        this.images = settings.images || {
            grass: 'url(images/grass.png)',
            bombFlag: 'url(images/bomb-flag.png)',
            bomb: 'url(images/bomb.png)',
            bombFail: 'url(images/bomb-fail.png)'
        };
    }

    // Инициализация игры
    init() {
        this.generateMines();
        this.createFieldMatrix();
        this.placeMinesAndHints();
        this.renderField();
        this.startTimer();
    }

    // Генерация мин на поле и настройка стилей поля
    generateMines() {
        while (this.mines.length < this.totalMines) {
            const randomWidth = Math.floor(Math.random() * this.fieldWidth);
            const randomHeight = Math.floor(Math.random() * this.fieldHeight);
            const newMine = [randomWidth, randomHeight];
            if (!this.mines.some(mine => mine[0] === randomWidth && mine[1] === randomHeight)) {
                this.mines.push(newMine);
            }
        }
        
        // Добавление стилей для поля
        this.fieldDIV.style.gridTemplateColumns = `repeat(${this.fieldWidth}, 1fr)`;
        this.fieldDIV.style.gridTemplateRows = `repeat(${this.fieldHeight}, 1fr)`;
        this.fieldDIV.style.width = `${this.fieldWidth * 60}px`;
        this.fieldDIV.style.height = `${this.fieldHeight * 60}px`;
    }

    // Создание матрицы поля
    createFieldMatrix() {
        this.fieldMatrix = Array.from({ length: this.fieldHeight }, () => Array(this.fieldWidth).fill(0));
    }

    // Размещение мин и подсказок на поле
    placeMinesAndHints() {
        for (const [x, y] of this.mines) {
            this.fieldMatrix[y][x] = '*';
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            for (const [dx, dy] of directions) {
                const newY = y + dy;
                const newX = x + dx;
                if (newY >= 0 && newY < this.fieldHeight && newX >= 0 && newX < this.fieldWidth && this.fieldMatrix[newY][newX] !== '*') {
                    this.fieldMatrix[newY][newX]++;
                }
            }
        }
    }

    // Отображение поля на экране
    renderField() {
        for (let y = 0; y < this.fieldHeight; y++) {
            for (let x = 0; x < this.fieldWidth; x++) {
                const cell = document.createElement('span');
                cell.dataset.mines = this.fieldMatrix[y][x];
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener('click', () => this.handleClick(cell));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(cell);
                });
                this.fieldDIV.appendChild(cell);
            }
        }
    }

    // Запуск таймера
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.isGameActive) {
                this.timer++;
                this.timerElement.innerText = this.timer;
            }
        }, 1000);
    }

    // Обработка клика по ячейке
    handleClick(cell) {
        if (!this.isGameActive) {
            return true;
        }

        this.moves++;
        this.movesElement.innerText = this.moves;

        const mines = cell.dataset.mines;
        const cellX = parseInt(cell.dataset.x);
        const cellY = parseInt(cell.dataset.y);

        if (mines != "*") {
            if (mines > 0) {
                cell.innerText = mines;
                this.setColor(cell, mines);
            } else {
                const allEmptyCells = this.findAllEmptyCells(this.fieldMatrix, cellY, cellX);
                for (let i = 0; i < allEmptyCells.length; i++) {
                    const [emptyY, emptyX] = allEmptyCells[i];
                    const emptyCell = this.fieldDIV.querySelector(`span[data-x="${emptyX}"][data-y="${emptyY}"]`);
                    emptyCell.innerText = 0;
                    this.setColor(emptyCell, 0);
                }
            }
            cell.innerText = mines;
            if (this.checkWin()) {
                this.isGameActive = false;
                clearInterval(this.timerInterval);
                alert("Победа!");
            }
        } else {
            this.isGameActive = false;
            clearInterval(this.timerInterval);
            const mineCells = this.fieldDIV.querySelectorAll(`span[data-mines="*"]`);
            for (let i = 0; i < mineCells.length; i++) {
                const mineCell = mineCells[i];
                this.setColor(mineCell, "bomb");
            }
            this.setColor(cell, "bomb-fail");
            alert("Потрачено :(");
        }
    }

    // Обработка правого клика по ячейке
    handleRightClick(cell) {
        if (!this.isGameActive) {
            return true;
        }
        if (cell.style.backgroundImage === `url("${this.images.bombFlag.slice(4, -1)}")`) {
            cell.style.backgroundImage = this.images.grass;
        } else {
            cell.style.backgroundImage = this.images.bombFlag;
        }
    }

    // Проверка на победу
    checkWin() {
        const cells = this.fieldDIV.querySelectorAll('span[data-mines]');
        for (const cell of cells) {
            if (cell.dataset.mines != "*" && cell.innerHTML.trim() == "") {
                return false;
            }
        }
        return true;
    }

    // Установка цвета ячейки в зависимости от количества мин
    setColor(cell, mines) {
        cell.style.backgroundImage = 'none';
        if (mines == 0) {
            cell.style.backgroundColor = "#e0dfdf";
        } else if (mines == "bomb") {
            cell.style.backgroundImage = this.images.bomb;
        } else if (mines == "bomb-fail") {
            cell.style.backgroundImage = this.images.bombFail;
        } else {
            const colors = {
                1: "#86c3f4",
                2: "#6ba9e0",
                3: "#4f8fcc",
                4: "#3475b8",
                5: "#195ba4",
                6: "#004190",
                7: "#00377c",
                8: "#002d68"
            };
            cell.style.backgroundColor = colors[mines] || "#86c3f4";
        }
    }

    // Поиск всех пустых ячеек вокруг заданной ячейки
    findAllEmptyCells(matrix, startY, startX) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const directions = [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1]
        ];
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const result = [];

        // Рекурсивный поиск в глубину
        function dfs(y, x) {
            if (y < 0 || y >= rows || x < 0 || x >= cols || matrix[y][x] !== 0 || visited[y][x]) {
                return;
            }
            visited[y][x] = true;
            result.push([y, x]);
            for (const [dy, dx] of directions) {
                dfs(y + dy, x + dx);
            }
        }
        dfs(startY, startX);
        return result;
    }

    // Перезапуск игры
    restartGame() {
        location.reload();
        // TODO запилить нормальный рестарт игры
    }
}