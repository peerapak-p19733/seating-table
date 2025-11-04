import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Select, Upload, Button, Card, Typography, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
import SlideToUnlock from "./components/SlideToUnlock";

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
const { Title, Text } = Typography;

export default function App() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(false);

  const fetchGuests = async () => {
      setLoading(true);
      const guestCol = collection(db, "seat");
      const guestSnapshot = await getDocs(guestCol);
      const guestList = guestSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGuests(guestList);
      setSelectedGuest(null);
      setLoading(false);
    };

  useEffect(() => {
    const guestListStorage = sessionStorage.getItem('guest');
    if (guestListStorage) {
      console.log('List')
      // setSelectedGuest(JSON.parse(guestListStorage));
      setLoading(false);
      setNextPage(true);

    } else {
      console.log('Fetch')
      fetchGuests();
    };
  }, []);

  useEffect(() => {
  return () => {
    // fires only when the tab is closing or reloading
    sessionStorage.removeItem('guest');
  };
}, []);

  const handleUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (const g of guests) {
        await deleteDoc(doc(db, "seat", g.id));
      }
      for (const row of rows) {
        await addDoc(collection(db, "seat"), {
          name: row.name || row.Name || "",
          table: row.table || row.Table || "",
        });
      }

      fetchGuests();
      message.success("Upload successful ✅");
    };
    reader.readAsArrayBuffer(file);
    return false; // prevent auto upload
  };

  const handleStoryPage = async () => {
    navigate("/story")
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading guest data..." size="large" />
      </div>
    );
  }

  const options = guests.map((g) => ({ label: g.name, value: g.id }));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/image/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // stays still on scroll
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {nextPage ? (
        <div className="frosted-content">
          <Title level={2}>🎉 Seating Chart 🎉</Title>
          <Select
            className="glass-search"
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder="Select or type your name..."
            options={options}
            optionFilterProp="label" // 👈 search by label instead of value
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(id) => {
              const guest = guests.find((g) => g.id === id);
              setSelectedGuest(guest || null);
              sessionStorage.setItem('guest', JSON.stringify(guest));
            }}
          />
          {selectedGuest && (
            <Card style={{ marginTop: 16, background: "#f6ffed" }}>
              <Text strong>{selectedGuest.name}</Text>
              <br />
              <Text>Table: {selectedGuest.table}</Text>
              <br />
              <img
                src={`/image/table-layout.jpg`}
                alt="Table Layout"
                style={{ width: "100%", marginTop: 12, borderRadius: 8 }}
              />
              <Button onClick={handleStoryPage} variant="link">
                มารู้จักพวกเราให้มากขึ้นกว่าเดิมกัน
              </Button>
            </Card>
          )}
        </div>

      ) : (
        // Welcome Page
        <SlideToUnlock onComplete={() => setNextPage(true)} />
      )}

      {/* Admin Upload */}
      {/* <Card style={{ marginTop: 24 }}>
        <Title level={4}>Admin: Upload new guest list</Title>
        <Upload beforeUpload={handleUpload} accept=".xlsx" showUploadList={false}>
          <Button icon={<UploadOutlined />}>Upload Excel</Button>
        </Upload>
      </Card> */}
    </div>
  );
}
