import saveAs from "file-saver";
import * as XLSX from 'xlsx';

export default function useCSVService() {

    const exportAsCSV = (array : any[], fileName : string) => {
        // Embed CSV data (array) it into a Blob, export it and inform the user
        const ws = XLSX.utils.json_to_sheet(array);
        const csv = XLSX.utils.sheet_to_csv(ws, {FS : ";"});
        const content = new Blob([csv], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        saveAs(content, fileName + ".csv");
    }

    const importCSVToList = (event : any) => {
        return new Promise<any[]>((resolve, _) => {

            const [file] = event.target.files;
            const reader = new FileReader();

            reader.onload = (evt : any) => {

                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_csv(ws);
                resolve(processCSVData(data));
              };
              reader.readAsBinaryString(file);
        })
    }

    const processCSVData = (dataString : any) => {
        console.log({dataString : dataString})
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
        var list = []
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length === headers.length) {
                const obj : any = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] === '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] === '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }
        
                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }
    
        return list
    }

    return {
        importCSVToList : importCSVToList,
        exportAsCSV : exportAsCSV
    }
}