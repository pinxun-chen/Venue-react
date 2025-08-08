import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPaymentByKey } from "../PayApi";

const PaymentResultPage = () => {

    // 取得 URL 參數（用來接收金流回傳的 KEY）
    const [params] = useSearchParams();

    // 初始資訊
    const [payData, setPayData] = useState(null); // 支付結果資料
    const [loading, setLoading] = useState(true); // 頁面載入狀態
    const [syncStatus, setSyncStatus] = useState(null); // 將付款結果同步到後端的狀態訊息

    const storeId = "govSystex1";

    // 從 URL 取得 KEY
    const key = params.get("KEY");

    // 初始查詢 getPaymentByKey
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPaymentByKey(storeId, key);
                setPayData(res.data?.[0]);

                const syncRes = await fetch("http://localhost:8081/api/payment/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(res),  // 把整個回傳 JSON 傳給後端
                });

                if (syncRes.ok) {
                    setSyncStatus("付款結果已儲存");
                } else {
                    const errText = await syncRes.text();
                    setSyncStatus("儲存失敗：" + errText);
                }

            } catch (err) {
                console.error("查詢支付結果失敗", err);
                setSyncStatus("發生錯誤，無法儲存付款資料");
            } finally {
                setLoading(false);
            }
        };

        // 如果 URL 有帶 KEY 才執行查詢
        if (key) fetchData();
    }, [key]);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>繳費成功</h2>

            {loading ? (
                <p>正在載入支付資訊...</p>
            ) : payData ? (
                <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem", borderRadius: "8px" }}>
                    <p><strong>訂單編號：</strong>{payData.order_no}</p>
                    <p><strong>付款方式：</strong>{payData.channel_name}</p>
                    <p><strong>付款狀態：</strong>{payData.pay_status_desc}</p>
                    <p><strong>付款金額：</strong>{payData.pay_amount}</p>
                    {syncStatus && (
                        <p style={{ marginTop: "1rem", fontWeight: "bold", color: syncStatus.startsWith("✅") ? "green" : "red" }}>
                            {syncStatus}
                        </p>
                    )}
                </div>
            ) : (
                <p>查無支付資料</p>
            )}
        </div>
    );
};

export default PaymentResultPage;
