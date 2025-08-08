import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEntryDateList, getPaymentInquiry } from "../PayApi";

const EntryDateList = () => {
    const [payDateInput, setPayDateInput] = useState(""); // 選擇繳費日期
    const [entryList, setEntryList] = useState([]); // 重後端查入帳資料
    const [entryLoading, setEntryLoading] = useState(false); // 查詢狀態
    const [entryError, setEntryError] = useState(""); // 查詢失敗時的錯誤訊息
    const [statusMap, setStatusMap] = useState({}); // 紀錄每筆訂單對應的狀態資料
    const [queried, setQueried] = useState(false); // 案查詢時會觸發他

    const navigate = useNavigate();

    const storeId = "govSystex1";
    const payCode = "004";

    // 取得今天日期
    const getToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}${mm}${dd}`;
    };

    // 查詢入帳資料
    const handleQueryEntry = async () => {
        const dateToUse = payDateInput || getToday(); // 沒選預設今天
        setPayDateInput(dateToUse);

        try {
            setEntryLoading(true); // 顯示「查詢中...」
            setEntryError(""); // 清空錯誤訊息
            setStatusMap({}); // 清空舊的訂單狀態資料
            setQueried(true); // 標記已按下查詢按鈕
            // 呼叫 API 查詢入帳資料
            const res = await getEntryDateList(storeId, payCode, "", payDateInput);
            setEntryList(res.data ?? []);
        } catch (err) {
            console.error("查詢入帳資訊失敗", err);
            setEntryError("查詢失敗，請稍後再試");
        } finally {
            setEntryLoading(false); // 關閉「查詢中...」狀態
        }
    };

    // 查詢單筆訂單狀態
    const handleQueryStatus = async (orderNo) => {
        try {
            // 呼叫 API 查詢訂單狀態
            const res = await getPaymentInquiry(storeId, String(orderNo));
            // API 回傳格式
            const item = Array.isArray(res?.data) ? res.data[0] : null;
            // 把狀態資料存進 statusMap
            setStatusMap(prev => ({
                ...prev,
                [String(orderNo)]: item ?? { pay_status_desc: "查無資料" },
            }));
        } catch (err) {
            console.error("查詢訂單狀態失敗", err);
            setStatusMap(prev => ({
                ...prev,
                [String(orderNo)]: { pay_status_desc: "查詢失敗" },
            }));
        }
    };

    // 時間格式化
    const formatDateTime = (str) => {
        if (!str || str.length !== 14) return str || "";
        return `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(6, 8)} ` +
            `${str.slice(8, 10)}:${str.slice(10, 12)}:${str.slice(12, 14)}`;
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h3>查詢入帳資訊</h3>

            {/* 日期輸入 + 查詢按鈕 */}
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
                        setQueried(false);
                    }}
                    style={{ padding: "6px" }}
                />
                <button onClick={handleQueryEntry} style={{ padding: "6px 12px" }}>
                    查詢入帳
                </button>
            </div>

            {/* 錯誤訊息 */}
            {entryError && <p style={{ color: "red" }}>{entryError}</p>}

            {/* 查詢中 */}
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

                            {/* 查詢訂單狀態 */}
                            <button
                                style={{ padding: "6px 12px", marginTop: "8px" }}
                                onClick={() => handleQueryStatus(item.order_no)}
                            >
                                查詢訂單狀態
                            </button>

                            {/* 顯示該筆訂單的狀態資料 */}
                            {statusMap[item.order_no] && (
                                <div style={{ marginTop: 8 }}>
                                    <p><strong>狀態：</strong>{statusMap[item.order_no].pay_status_desc}</p>
                                    {statusMap[item.order_no].channel_name && (
                                        <>
                                            <p><strong>繳費方式：</strong>{statusMap[item.order_no].channel_name}</p>
                                            <p><strong>付款時間：</strong>{formatDateTime(statusMap[item.order_no].pay_datetime)}</p>
                                        </>
                                    )}
                                </div>
                            )}


                        </div>
                    ))}
                </div>
            ) : (
                queried && payDateInput && <p style={{ color: "gray" }}>查無入帳資料</p>
            )}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/bookings")}>返回預約查詢</button>
            </div>
        </div>
    );
};

export default EntryDateList;
