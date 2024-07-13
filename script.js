document.getElementById('addRowBtn').addEventListener('click', function() {
    const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const xCell = newRow.insertCell(0);
    const yCell = newRow.insertCell(1);

    xCell.innerHTML = '<input type="number" class="x-value" required>';
    yCell.innerHTML = '<input type="number" class="y-value" required>';
});

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const xValues = Array.from(document.getElementsByClassName('x-value')).map(input => parseFloat(input.value));
    const yValues = Array.from(document.getElementsByClassName('y-value')).map(input => parseFloat(input.value));
    const interpolateX = parseFloat(document.getElementById('interpolateX').value);

    if (xValues.length < 2 || yValues.length < 2) {
        document.getElementById('output').textContent = 'Please enter at least two data points.';
        return;
    }

    const points = xValues.map((x, i) => ({ x, y: yValues[i] }));
    const { polynomial, interpolatedValue } = newtonForwardInterpolation(points, interpolateX);
    document.getElementById('output').textContent = `Newton Forward Interpolation Polynomial: P(x) = ${polynomial}\n\nInterpolated value at x = ${interpolateX}: P(${interpolateX}) = ${interpolatedValue}`;
});

function newtonForwardInterpolation(points, x) {
    const n = points.length;
    const xi = points.map(p => p.x);
    const yi = points.map(p => p.y);

    let diffTable = Array.from({ length: n }, (_, i) => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        diffTable[i][0] = yi[i];
    }

    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diffTable[i][j] = diffTable[i + 1][j - 1] - diffTable[i][j - 1];
        }
    }

    const h = xi[1] - xi[0];
    let polynomial = `${yi[0]}`;
    let interpolatedValue = yi[0];
    let productTerms = 1;

    for (let i = 1; i < n; i++) {
        productTerms *= (x - xi[i - 1]);
        const term = diffTable[0][i] / (factorial(i) * Math.pow(h, i));
        polynomial += ` + (${term} * ${(Array(i).fill(null).map((_, j) => `(x - ${xi[j]})`).join(' * '))})`;
        interpolatedValue += term * productTerms;
    }

    return { polynomial, interpolatedValue };
}

function factorial(num) {
    if (num === 0) return 1;
    return num * factorial(num - 1);
}