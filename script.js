document.getElementById('convert-button').addEventListener('click', () => {
    const input = document.getElementById('input-file');
    if (!input.files.length) {
        alert('Por favor, suba un archivo Excel.');
        return;
    }
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const txtOutput = json.map(row => {
            return row.join('\t');
        }).join('\n');

        document.getElementById('output').textContent = txtOutput;

        const blob = new Blob([txtOutput], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = url;
        downloadLink.download = 'output.txt';
        downloadLink.style.display = 'block';
    };

    reader.readAsArrayBuffer(file);
});
