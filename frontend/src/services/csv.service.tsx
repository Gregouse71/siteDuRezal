import saveAs from "file-saver";

export default function useCSVService() {
    const exportAsCSV = async (array: any[], fileName: string) => {
        const XLSX = await import("xlsx");
        // Embed CSV data (array) it into a Blob, export it and inform the user
        const ws = XLSX.utils.json_to_sheet(array);
        const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });
        const content = new Blob([csv], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(content, fileName + ".csv");
    };

    const importCSVToList = (event: any) => {
        return new Promise<any[]>((resolve) => {
            const [file] = event.target.files;
            const reader = new FileReader();

            reader.onload = async (evt) => {
                const XLSX = await import("xlsx");
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_csv(ws);

                // Parsing CSV manually or using a simple split since we want simple array
                const rows = data.split("\n");
                const headers = rows[0].split(",");
                const result = rows
                    .slice(1)
                    .filter((r) => r.trim() !== "")
                    .map((row) => {
                        const values = row.split(",");
                        return headers.reduce((obj, header, index) => {
                            obj[header.trim()] = values[index]?.trim();
                            return obj;
                        }, {} as any);
                    });

                resolve(result);
            };
            reader.readAsBinaryString(file);
        });
    };

    return {
        exportAsCSV: exportAsCSV,
        importCSVToList: importCSVToList,
    };
}
