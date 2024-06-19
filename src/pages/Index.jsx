import React, { useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("edited_csv.csv");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setCsvData(results.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (e, rowIndex, header) => {
    const newData = [...csvData];
    newData[rowIndex][header] = e.target.value;
    setCsvData(newData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Upload, Edit, and Download</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {csvData.length > 0 && (
        <>
          <Table>
            <TableCaption>Editable CSV Data</TableCaption>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleCellChange(e, rowIndex, header)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow} className="mt-4">
            Add Row
          </Button>
          <CSVLink data={csvData} headers={headers} filename={fileName} className="mt-4">
            <Button>Download CSV</Button>
          </CSVLink>
        </>
      )}
    </div>
  );
};

export default Index;