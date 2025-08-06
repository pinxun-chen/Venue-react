import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPayProviders, createPayOrder } from "../PayApi";

const CreatePaymentPage = () => {
    const { state } = useLocation();
    const booking = state.booking;

    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // getPaySvcProvider
    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getPayProviders("govSystex1", "004");
            if (res?.status === 0) {
                setProviders(res.data);
            } else {
                alert("取得付款方式失敗");
            }
            setLoading(false);
        };
        fetchProviders();
    }, []);

    // doPay 
    const handlePay = async (providerCode) => {
        const payload = {
            store_id: "govSystex1",
            pay_code: "004",
            provider_code: providerCode,
            order_no: `${booking.id}`, // 或根據你需要的規則產生
            pay_end_date: "99991231",
            total_amount: booking.venuePrice.toString(),
            opt_interface: "1",
            data: [
                {
                    item_name: `${booking.venueName} 場地租借`,
                    unit_price: booking.venuePrice.toString(),
                    unit_count: "1",
                    unit_amount: booking.venuePrice.toString(),
                },
            ],
        };

        const res = await createPayOrder(payload);
        if (res?.status === 0) {
            const payInfo = res.data[0];
            if (payInfo.payment_url_web) {
                window.open(payInfo.payment_url_web, "_blank");
            } else {
                alert("未取得付款網址");
            }
        } else {
            alert("付款初始化失敗");
        }
    };

    if (loading) return <div>載入付款方式中...</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>地點: {booking.venueName}
                <br /> 日期: {booking.bookingDate}
                <br /> 時段: {booking.label}
                <br /> 價格: {booking.venuePrice}
            </h2>

            <h3>選擇付款方式 </h3>

            <ul>
                {providers.map((p) => (
                    <li key={p.ins_acct_code} style={{ marginBottom: "1rem" }}>
                        <div>{p.ins_acct_name}</div>
                        <button onClick={() => handlePay(p.ins_acct_code)}>
                            用此方式付款
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/bookings")}>返回預約查詢</button>
            </div>
        </div>
        
    );
};

export default CreatePaymentPage;
