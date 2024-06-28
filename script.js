document.getElementById('convertButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Por favor, selecciona un archivo Excel.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const maxLengths = json[0].map((_, colIndex) => {
            return Math.max(...json.map(row => (row[colIndex] || '').toString().length));
        });

        const txtOutput = json.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                return (cell || '').toString().padEnd(maxLengths[cellIndex] + 2, ' ');
            }).join('');
        }).join('\n');

        const blob = new Blob([txtOutput], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name.replace(/\.[^/.]+$/, ".txt");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const downloadLink = document.getElementById('download-link');
        downloadLink.href = link.href;
        downloadLink.style.display = 'block';
    };

    reader.readAsArrayBuffer(file);
});
