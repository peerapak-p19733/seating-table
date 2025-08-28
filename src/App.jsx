import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { QRCodeCanvas } from "qrcode.react";

export default function App() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedData = localStorage.getItem("guestData");
    if (savedData) {
      setGuests(JSON.parse(savedData));
    }
  }, []);

  // Admin uploads Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setGuests(data);
      localStorage.setItem("guestData", JSON.stringify(data));
      setResult(null);
      setSearch("");
    };
    reader.readAsBinaryString(file);
  };

  // Guest searches name
  const handleSearch = () => {
    const res = guests.find(
      (g) => g.Name.toLowerCase() === search.trim().toLowerCase()
    );
    setResult(res || null);
  };

  // Conditional rendering: Upload page or Search page
  const hasData = guests.length > 0;
  console.log(hasData);

  return (
    <div className="app">
      <h1>🎉 Seating Chart Search 🎉</h1>

      {!hasData ? (
        // Upload page
        <div style={{ marginTop: "20px" }}>
          <p>Admin: Upload guest Excel file to start</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </div>
      ) : (
        // Search page
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "10px", marginRight: "10px", width: "250px" }}
          />
          <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
            Search
          </button>

          {result && (
            <div style={{ marginTop: "20px" }}>
              <p>
                <strong>Name:</strong> {result.Name}
              </p>
              <p>
                <strong>Table:</strong> {result.Table}
              </p>
              <p>
                <strong>Seat:</strong> {result.Seat}
              </p>
            </div>
          )}

          {search && !result && (
            <p style={{ marginTop: "20px" }}>No matching guest found.</p>
          )}
        </div>
      )}
    </div>
  );
}
