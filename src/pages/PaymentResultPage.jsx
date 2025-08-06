import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPaymentByKey } from "../PayApi";

const PaymentResultPage = () => {
    const [params] = useSearchParams();

    // 初始資訊
    const [payData, setPayData] = useState(null);
    const [loading, setLoading] = useState(true);

    const storeId = "govSystex1";

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
                </div>
            ) : (
                <p>查無支付資料</p>
            )}
        </div>
    );
};

export default PaymentResultPage;
