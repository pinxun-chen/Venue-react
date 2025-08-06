import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEntryDateList } from "../PayApi";

const EntryDateList = () => {
    const [payDateInput, setPayDateInput] = useState("");
    const [entryList, setEntryList] = useState([]);
    const [entryLoading, setEntryLoading] = useState(false);
    const [entryError, setEntryError] = useState("");

    const navigate = useNavigate();

    const storeId = "govSystex1";
    const payCode = "004";

    const handleQueryEntry = async () => {
        if (!payDateInput) {
            setEntryError("請選擇繳費日期");
            return;
        }

        try {
            setEntryLoading(true);
            setEntryError("");
            const res = await getEntryDateList(storeId, payCode, "", payDateInput);
            setEntryList(res.data ?? []);
        } catch (err) {
            console.error("查詢入帳資訊失敗", err);
            setEntryError("查詢失敗，請稍後再試");
        } finally {
            setEntryLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h3>查詢入帳資訊</h3>

            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                    type="date"
                    value={
                        payDateInput
                            ? `${payDateInput.slice(0, 4)}-${payDateInput.slice(4, 6)}-${payDateInput.slice(6, 8)}`
                            : ""
                    }
                    onChange={(e) => {
                        const selected = e.target.value.replaceAll("-", "");
                        setPayDateInput(selected);
                    }}
                    style={{ padding: "6px" }}
                />
                <button onClick={handleQueryEntry} style={{ padding: "6px 12px" }}>
                    查詢入帳
                </button>
            </div>

            {entryError && <p style={{ color: "red" }}>{entryError}</p>}

            {entryLoading ? (
                <p>查詢中...</p>
            ) : entryList.length > 0 ? (
                <div>
                    <h4>入帳資料</h4>
                    {entryList.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "1rem",
                                marginBottom: "1rem",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <p><strong>訂單編號：</strong>{item.order_no}</p>
                            <p><strong>金額：</strong>{item.amount}</p>
                            <p><strong>繳費時間：</strong>{item.pay_etime}</p>
                            <p><strong>商品名稱：</strong>{item.item_name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                payDateInput && <p style={{ color: "gray" }}>查無入帳資料</p>
            )}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/bookings")}>返回預約查詢</button>
            </div>
        </div>
    );
};

export default EntryDateList;
