import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getVenueById,
    getVenueTimeSlots,
    getBookingsByVenueAndDate,
    createBooking,
} from "../api";

function BookingPage() {

    const { venueId } = useParams();
    const [venue, setVenue] = useState([]); // 從後端撈場地資料
    const [date, setDate] = useState(""); // 選擇的日期
    const [timeSlots, setTimeSlots] = useState([]); // 場地對應的時段
    const [bookedIds, setBookedIds] = useState([]); // 該日已被預約且付款完成的時段
    const [selectedIds, setSelectedIds] = useState([]); // 使用者選取的時段
    const [form, setForm] = useState({
        renterName: "",
        renterEmail: "",
        renterPhone: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loadVenue = async () => {
            const res = await getVenueById(venueId);

            if (res.status === 200) {
                setVenue(res.data); // 儲存場地資訊
            } else {
                alert("找不到場地資訊");
            }
        };
        loadVenue();
    }, [venueId]);

    // 取得明天的日期 (只能預約明天以後的)
    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    // 當選擇日期後載入該日的可用時段與已被預約的時段
    const handleDateChange = async (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        setSelectedIds([]);

        const res1 = await getVenueTimeSlots(venue.id);
        const res2 = await getBookingsByVenueAndDate(venue.id, newDate);

        if (res1.status === 200) {
            setTimeSlots(res1.data);
        }

        if (res2.status === 200) {
            const paid = res2.data.filter((b) => b.isPaid).map((b) => b.timeSlotId);
            setBookedIds(paid);
        }
    };

    // 時段勾選
    const handleToggle = (id, checked) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id)
        );
    };

    // 使用者填寫表單資料
    const handleFormChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 提交預約
    const handleSubmit = async () => {
        if (!venue || !date || selectedIds.length === 0) {
            alert("請選擇完整資訊");
            return;
        }

        if (!form.renterName || !form.renterEmail || !form.renterPhone) {
            alert("請完整填寫聯絡資訊");
            return;
        }

        try {
            for (const slotId of selectedIds) {
                const req = {
                    venueId: venue.id,
                    bookingDate: date,
                    timeSlotId: slotId,
                    ...form,
                };
                await createBooking(req);
            }
            alert("預約成功，請去繳費");
            setSelectedIds([]);

            navigate("/bookings"); // 預約成功後跳轉到預約管理頁面
        } catch (err) {
            alert(`預約失敗：${err.message}`);
        }
    };

    // 計算總價
    const totalPrice = selectedIds.length * (venue?.price || 0);

    return (

        <div style={{
            padding: "20px",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2>{venue.name}</h2>

            {/* 場地基本資訊 */}
            <div style={{ marginBottom: "10px" }}>
                <p>
                    <strong>地點：</strong>
                    {venue.location}
                </p>
                <p>
                    <strong>說明：</strong>
                    {venue.description}
                </p>
                <p>
                    <strong>單價：</strong>
                    {venue.price} 元／時段
                </p>
            </div>

            {/* 日期選擇 */}
            <label>選擇日期：</label>
            <input
                type="date"
                value={date}
                min={getTomorrow()}
                onChange={handleDateChange}
            />

            {/* 時段勾選 */}
            {timeSlots.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                    <h4>可預約時段：</h4>
                    {timeSlots.map((slot) => {
                        const isDisabled = bookedIds.includes(slot.id);
                        return (
                            <label
                                key={slot.id}
                                style={{
                                    display: "block",
                                    color: isDisabled ? "gray" : "black",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    disabled={isDisabled}
                                    checked={selectedIds.includes(slot.id)}
                                    onChange={(e) => handleToggle(slot.id, e.target.checked)}
                                />
                                {slot.timeLabel}
                            </label>
                        );
                    })}
                    <p style={{ marginTop: "10px" }}>
                        <strong>總金額：</strong>
                        {totalPrice} 元
                    </p>
                </div>
            )}

            {/* 表單 */}
            {selectedIds.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                    <h4>填寫預約人資訊</h4>
                    <input
                        name="renterName"
                        placeholder="姓名"
                        onChange={handleFormChange}
                    />
                    <br />
                    <input
                        name="renterEmail"
                        placeholder="Email"
                        onChange={handleFormChange}
                    />
                    <br />
                    <input
                        name="renterPhone"
                        placeholder="電話"
                        onChange={handleFormChange}
                    />
                    <br />
                    <button style={{ marginTop: "10px" }} onClick={handleSubmit}>
                        送出預約
                    </button>
                </div>
            )}

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/")}>返回</button>
            </div>
        </div>

    );
}

export default BookingPage;