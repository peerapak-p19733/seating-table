import React, { useEffect, useState } from "react";
import Select from "react-select";
import * as XLSX from "xlsx";
import { QRCodeCanvas } from "qrcode.react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBok47DNTF-OhcVJqmU1_c2Vkt4RgOdzbY",
  authDomain: "wedding-a91ff.firebaseapp.com",
  databaseURL: "https://wedding-a91ff-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedding-a91ff",
  storageBucket: "wedding-a91ff.firebasestorage.app",
  messagingSenderId: "826573826467",
  appId: "1:826573826467:web:bf21ac3e79a14c1ba39216",
  measurementId: "G-RHR1KYDH60"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch guests from Firestore
  const fetchGuests = async (factor) => {
    const guestCol = collection(db, "seat");
    const guestSnapshot = await getDocs(guestCol);
    const guestList = guestSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(guestList)
    setGuests(guestList);
    setLoading(false);
    setResult(null)
    setSearch("")
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // Upload Excel and insert to Firebase
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Clear old guests first (optional)
      for (const g of guests) {
        await deleteDoc(doc(db, "seat", g.id));
      }

      // Insert new rows
      for (const row of rows) {
        await addDoc(collection(db, "seat"), {
          name: row.name || row.Name || "",
          table: row.table || row.Table || "",
        });
      }

      fetchGuests(); // reload
      alert("Upload successful ✅");
    };
    reader.readAsArrayBuffer(file);
  };

  // Prepare options for react-select
  const options = guests.map((g) => ({ value: g.id, label: g.name }));

  // Handle selection
  const handleChange = (option) => {
    const guest = guests.find((g) => g.id === option?.value);
    setSelectedGuest(guest || null);
  };

  if (loading) return <p>Loading guest data...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎉 Seating Chart 🎉</h1>

      {/* If no data → upload page */}
      {guests.length === 0 ? (
        <div>
          <p>No guest data found. Please upload Excel:</p>
          <input type="file" accept=".xlsx" onChange={handleUpload} />
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={fetchGuests}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px 16px",
              backgroundColor: "#4c1d95",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          {/* Searchable Dropdown */}
          <Select
            options={options}
            onChange={handleChange}
            placeholder="Select or type your name..."
            isClearable
          />

          {/* Display Result */}
          {selectedGuest && (
            <div className="mt-6 p-4 rounded-lg shadow bg-green-100">
              <p className="text-lg font-semibold">{selectedGuest.name}</p>
              <p>
                <b>Table:</b> {selectedGuest.table}
              </p>
                <img
                  src={`/image/table-layout.jpg`}
                  className="mt-3 mx-auto rounded shadow w-32 p-2"
                />
            </div>
          )}


          {search && !result && (
            <p style={{ marginTop: "20px" }}>No matching guest found.</p>
          )}
        </div>
      )}

      {/* Upload option for admin even when data exists */}
      <div style={{ marginTop: "40px" }}>
        <h3>Admin: Upload new guest list</h3>
        <input type="file" accept=".xlsx" onChange={handleUpload} />
      </div>

      {/* QR Code */}
      <div style={{ marginTop: "40px" }}>
        <h2>Scan this QR code to open the app</h2>
        <QRCodeCanvas
          value="https://myseatingapp.vercel.app" // Replace with deployed URL
          size={200}
          bgColor="#ffffff"
          fgColor="#4c1d95"
          level="H"
          includeMargin={true}
        />
      </div>
    </div>
  );
}
