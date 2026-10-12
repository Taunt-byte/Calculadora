const display = document.querySelector("#result");
const buttons = document.querySelector(".buttons");
const actions = document.querySelector(".actions");

let expression = "";

// Atualiza o visor
function updateDisplay() {
    display.value = expression;
}

// Adiciona um número ou operador à expressão
function appendValue(value) {
    const operators = ["+", "-", "*", "/"];
    const lastCharacter = expression.slice(-1);

    // Evita operadores consecutivos incorretos
    if (operators.includes(value)) {
        if (expression === "") {
            if (value !== "-") return;
        } else if (operators.includes(lastCharacter)) {
            if (value === "-" && lastCharacter !== "-") {
                expression += value;
                updateDisplay();
                return;
            }

            expression = expression.slice(0, -1);
        }
    }

    // Permite apenas um ponto decimal por número
    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) return;
    }

    expression += value;
    updateDisplay();
}

// Calcula o resultado da expressão
function calculate() {
    if (!expression) return;

    // Aceita somente números, operadores e pontos
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        display.value = "Expressão inválida";
        expression = "";
        return;
    }

    try {
        // Confere se a expressão termina com um número ou parêntese
        if (/[+\-*/.]$/.test(expression)) {
            display.value = "Expressão incompleta";
            return;
        }

        // A expressão já foi limitada aos caracteres matemáticos aceitos.
        const result = Function(`"use strict"; return (${expression})`)();

        if (!Number.isFinite(result)) {
            display.value = "Erro matemático";
            expression = "";
            return;
        }

        expression = String(Number(result.toPrecision(12)));
        updateDisplay();
    } catch {
        display.value = "Expressão inválida";
        expression = "";
    }
}

// Apaga o último caractere
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

// Limpa toda a expressão
function clearAll() {
    expression = "";
    updateDisplay();
}

// Eventos dos botões numéricos e operadores
buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    const value = button.dataset.value;

    if (value !== undefined) {
        appendValue(value);
    } else if (button.dataset.action === "calculate") {
        calculate();
    }
});

// Eventos dos botões de limpeza
actions.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.action === "clear") {
        clearAll();
    }

    if (button.dataset.action === "delete") {
        deleteLast();
    }
});
