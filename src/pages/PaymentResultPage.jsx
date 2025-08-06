import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPaymentByKey, getEntryDateList } from "../PayApi";

const PaymentResultPage = () => {
    const [params] = useSearchParams();

    // 初始資訊
    const [payData, setPayData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 入帳資訊相關
    const [payDateInput, setPayDateInput] = useState("");
    const [entryList, setEntryList] = useState([]);
    const [entryLoading, setEntryLoading] = useState(false);
    const [entryError, setEntryError] = useState("");

    const storeId = "govSystex1";
    const payCode = "004";

    const key = params.get("KEY");

    // 初始查詢 getPaymentByKey
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPaymentByKey(storeId, key);
                setPayData(res.data?.[0]);
            } catch (err) {
                console.error("查詢支付結果失敗", err);
            } finally {
                setLoading(false);
            }
        };

        if (key) fetchData();
    }, [key]);

    // 點擊按鈕查詢入帳資訊
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
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h2>繳費成功</h2>

            {loading ? (
                <p>正在載入支付資訊...</p>
            ) : payData ? (
                <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem", borderRadius: "8px" }}>
                    <p><strong>訂單編號：</strong>{payData.order_no}</p>
                    <p><strong>付款方式：</strong>{payData.channel_name}</p>
                    <p><strong>付款狀態：</strong>{payData.pay_status_desc}</p>
                    <p><strong>付款金額：</strong>{payData.pay_amount}</p>
                </div>
            ) : (
                <p>查無支付資料</p>
            )}

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
        </div>
    );
};

export default PaymentResultPage;
