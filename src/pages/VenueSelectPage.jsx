import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVenues, getVenueByName } from "../api";

const VenueSelectPage = () => {
    const [venues, setVenues] = useState([]); // 所有場地資料
    const [search, setSearch] = useState(""); // 搜尋欄輸入內容
    const navigate = useNavigate();

    // 一開始載入全部場地
    useEffect(() => {
        loadAllVenues();
    }, []);

    // 載入所有場地
    const loadAllVenues = async () => {
        const res = await getAllVenues();
        if (res.status === 200) {
            setVenues(res.data);
        };
    };

    // 搜尋
    const handleSearch = async () => {
        if (search.trim() === "") {
            loadAllVenues();
        } else {
            const res = await getVenueByName(search);
            if (res.status === 200) {
                setVenues(res.data);
            } else {
                alert('查無資料');
            }
        }
    };

    // 點選場地會導向預約
    const handleSelect = (venue) => {
        navigate(`/booking/${venue.id}`);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>請選擇場地</h2>

            {/* 查詢預約按鈕 */}
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => navigate("/bookings")}>查詢預約</button>
            </div>

            {/* 搜尋欄與操作 */}
            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="輸入場地名稱..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: "6px", width: "200px", marginRight: "10px" }}
                />
                <button onClick={handleSearch}>搜尋</button>
                <button
                    onClick={() => {
                        setSearch("");
                        loadAllVenues();
                    }}
                    style={{ marginLeft: "10px" }}
                >
                    清除
                </button>
            </div>

            {/* 場地列表 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {venues.map((v) => (
                    <div
                        key={v.id}
                        onClick={() => handleSelect(v)}
                        style={{
                            border: "1px solid gray",
                            padding: "1rem",
                            width: "250px",
                            borderRadius: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <h3>{v.name}</h3>
                        <p>地點：{v.location}</p>
                        <p>說明：{v.description}</p>
                        <p>每時段 NT$ {v.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VenueSelectPage;
