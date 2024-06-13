let globalData = null;
let autoMinValue = Number.POSITIVE_INFINITY;
let autoMaxValue = Number.NEGATIVE_INFINITY;

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        globalData = reader.result;
        calculateMinMax();
        updateColorMap();
    };
});

document.getElementById('updateButton').addEventListener('click', function() {
    updateColorMap();
    scrollToColorMap();
});

document.getElementById('saveButton').addEventListener('click', function() {
    saveColorMapAsImage();
});

function calculateMinMax() {
    if (!globalData) return;

    const lines = globalData.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const rowData = lines[i].split(',');
        rowData.forEach(cell => {
            const numericValue = parseFloat(cell);
            if (!isNaN(numericValue)) {
                if (numericValue < autoMinValue) autoMinValue = numericValue;
                if (numericValue > autoMaxValue) autoMaxValue = numericValue;
            }
        });
    }

    document.getElementById('minValue').value = autoMinValue;
    document.getElementById('maxValue').value = autoMaxValue;
}

function updateColorMap() {
    if (!globalData) return;

    const minValue = parseFloat(document.getElementById('minValue').value);
    const maxValue = parseFloat(document.getElementById('maxValue').value);

    const lines = globalData.split('\n');
    const headers = lines[0].split(',');
    const colorMap = document.getElementById('colorMap');
    colorMap.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    for (let i = 1; i < lines.length; i++) {
        const rowData = lines[i].split(',');
        const row = document.createElement('tr');
        rowData.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            const numericValue = parseFloat(cell);
            if (!isNaN(numericValue)) {
                td.style.backgroundColor = getColorForValue(numericValue, minValue, maxValue);
            }
            row.appendChild(td);
        });
        table.appendChild(row);
    }

    colorMap.appendChild(table);
}

function getColorForValue(value, min, max) {
    if (value <= min) {
        return document.getElementById('color1').value; // Use the color for 1-10% for min values
    } else if (value > max) {
        return document.getElementById('color10').value; // Use the color for 91-100% for max values
    } else {
        const percentage = (value - min) / (max - min) * 100;
        if (percentage <= parseFloat(document.getElementById('percent1').value)) {
            return document.getElementById('color1').value;
        } else if (percentage <= parseFloat(document.getElementById('percent2').value)) {
            return document.getElementById('color2').value;
        } else if (percentage <= parseFloat(document.getElementById('percent3').value)) {
            return document.getElementById('color3').value;
        }
        // 各パーセント範囲に対応する色を追加
    }
}

function saveColorMapAsImage() {
    const colorMap = document.getElementById('colorMap');
    html2canvas(colorMap).then(canvas => {
        const link = document.createElement('a');
        link.download = 'colorMap.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function scrollToColorMap() {
    const colorMap = document.getElementById('colorMap');
    colorMap.scrollIntoView({ behavior: 'smooth' });
}
