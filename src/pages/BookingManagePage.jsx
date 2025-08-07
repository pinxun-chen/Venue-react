import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getBookingsByEmail,
    getBookingsByName,
    getBookingsByPhone,
    updateBooking,
    deleteBooking,
    getAllBookings,
} from "../api";

const BookingManagePage = () => {
    const [searchType, setSearchType] = useState("email"); // 搜尋類型
    const [searchValue, setSearchValue] = useState(""); // 使用者輸入值
    const [bookings, setBookings] = useState([]); // 查詢結果
    const [editingId, setEditingId] = useState(null); // 正在編輯的 bookingId
    const [editForm, setEditForm] = useState({
        renterName: "",
        renterEmail: "",
        renterPhone: "",
    });

    // 一開始就載入所有預約
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const res = await getAllBookings();
        if (res.status === 200) {
            setBookings(res.data);
        } else {
            setBookings([]);
        }
    };

    // 查詢預約
    const handleSearch = async () => {
        let res;
        if (searchValue.trim() === '') {
            // 空的時查詢全部預約
            fetchAll();
        } else {
            // 否則根據選擇欄位查詢
            if (searchType === 'email') {
                res = await getBookingsByEmail(searchValue);
            } else if (searchType === 'name') {
                res = await getBookingsByName(searchValue);
            } else if (searchType === 'phone') {
                res = await getBookingsByPhone(searchValue);
            }
        }

        if (res?.status === 200) {
            setBookings(res.data);
        } else {
            alert("查無對應資料");
            fetchAll();
        }
    };

    // 點擊「編輯」按鈕時，載入當前資料進入編輯欄位
    const handleEditClick = (booking) => {
        setEditingId(booking.id);
        setEditForm({
            renterName: booking.renterName,
            renterEmail: booking.renterEmail,
            renterPhone: booking.renterPhone,
        });
    };

    // 保存
    const handleSaveEdit = async (bookingId) => {
        const booking = bookings.find((b) => b.id === bookingId); // 找到該筆原始資料

        const updateData = {
            venueId: booking.venueId,
            timeSlotId: booking.timeSlotId,
            bookingDate: booking.bookingDate,
            renterName: editForm.renterName,
            renterEmail: editForm.renterEmail,
            renterPhone: editForm.renterPhone,
        };

        const res = await updateBooking(bookingId, updateData);

        if (res?.status === 200) {
            alert("更新成功");
            setEditingId(null);

            fetchAll(); // 重新查詢
        } else {
            alert("更新失敗");
        }
    };

    // 取消預約
    const handleDelete = async (bookingId) => {
        if (!window.confirm("確定要取消這筆預約嗎？")) {
            return;
        }

        const res = await deleteBooking(bookingId);

        if (res?.status === 200) {
            alert("取消成功");
            fetchAll(); // 重新查詢
            setSearchValue("");
        } else {
            alert("取消失敗");
        }
    };

    const navigate = useNavigate();

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>預約管理</h2>

            {/* 查詢表單 */}
            <div style={{ marginBottom: "20px" }}>
                <label>查詢類型：</label>
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="email">Email</option>
                    <option value="name">姓名</option>
                    <option value="phone">電話</option>
                </select>

                <input
                    type="text"
                    placeholder="請輸入查詢內容"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                />

                <button onClick={handleSearch}>查詢</button>

                <button
                    onClick={() => {
                        setSearchValue("");
                        fetchAll();
                    }}
                    style={{ marginLeft: "10px" }}
                >
                    清除
                </button>
            </div>

            {/* 結果列表 */}
            {bookings.length === 0 ? (
                <p>尚無資料</p>
            ) : (
                <table
                    border="1"
                    cellPadding="6"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                >
                    <thead>
                        <tr>
                            <th>訂單編號</th>
                            <th>場地</th>
                            <th>日期</th>
                            <th>時段</th>
                            <th>價格</th>
                            <th>姓名</th>
                            <th>Email</th>
                            <th>電話</th>
                            <th>操作</th>
                            <th>繳費</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.venueName}</td>
                                <td>{booking.bookingDate}</td>
                                <td>{booking.label}</td>
                                <td>{booking.venuePrice}</td>

                                {/* 編輯欄位 or 文字顯示 */}
                                {editingId === booking.id ? (
                                    <>
                                        <td>
                                            <input
                                                value={editForm.renterName}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        renterName: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editForm.renterEmail}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        renterEmail: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editForm.renterPhone}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        renterPhone: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleSaveEdit(booking.id)}>
                                                儲存
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                style={{ marginLeft: "5px" }}
                                            >
                                                取消
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{booking.renterName}</td>
                                        <td>{booking.renterEmail}</td>
                                        <td>{booking.renterPhone}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(booking)}>
                                                更新預約
                                            </button>
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                style={{ marginLeft: "5px" }}
                                            >
                                                取消預約
                                            </button>
                                        </td>
                                        <td>
                                            {booking.isPaid ? (
                                                <button disabled style={{ color: "gray" }}>已繳費</button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate("/create-payment", { state: { booking } })}
                                                    style={{ marginLeft: "5px" }}
                                                >
                                                    繳費
                                                </button>
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ margin: "20px" }}>
                <button onClick={() => navigate("/EntryDateList")}>依日期查詢入帳資訊</button>
            </div>

            <div style={{ margin: "20px" }}>
                <button onClick={() => navigate("/")}>返回</button>
            </div>
        </div>
    );
};

export default BookingManagePage;
