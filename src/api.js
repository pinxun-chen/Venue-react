const API_BASE = "http://localhost:8081/api";

// 查詢所有場地 (VenueSelectPage)
export const getAllVenues = async () => {
    const res = await fetch(`${API_BASE}/venues`);
    return res.json();
};

// 查詢單一場地 (BookingPage)
export const getVenueById = async (id) => {
    const res = await fetch(`${API_BASE}/venues/${id}`);
    return await res.json();
};

// 模糊搜尋場地 (VenueSelectPage)
export const getVenueByName = async (name) => {
    const res = await fetch(`${API_BASE}/venues?name=${encodeURIComponent(name)}`);
    return await res.json();
};

// 查詢指定場地的可租借時段 (BookingPage)
export const getVenueTimeSlots = async (venueId) => {
    const res = await fetch(`${API_BASE}/venue-times/venue/${venueId}`);
    return await res.json();
};

// 建立預約資料 (BookingPage)
export const createBooking = async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
    });
    return await res.json();
};

// 根據 Email 查詢預約 (BookingManagePage)
export const getBookingsByEmail = async (email) => {
    const res = await fetch(`${API_BASE}/bookings?email=${encodeURIComponent(email)}`);
    return await res.json();
};

// 根據姓名查詢預約 (BookingManagePage)
export const getBookingsByName = async (name) => {
    const res = await fetch(`${API_BASE}/bookings?name=${encodeURIComponent(name)}`);
    return await res.json();
};

// 根據電話查詢預約 (BookingManagePage)
export const getBookingsByPhone = async (phone) => {
    const res = await fetch(`${API_BASE}/bookings?phone=${encodeURIComponent(phone)}`);
    return await res.json();
};

// 根據場地與日期查詢預約 (BookingPage)
export const getBookingsByVenueAndDate = async (venueId, date) => {
    const res = await fetch(`${API_BASE}/bookings/venue/${venueId}/date/${date}`);
    return await res.json();
};

// 修改預約資料 (BookingManagePage)
export const updateBooking = async (id, updateData) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });
    return await res.json();
};

// 取消預約 (BookingManagePage)
export const deleteBooking = async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
    });
    return await res.json();
};

// 查詢全部預約 (BookingManagePage)
export const getAllBookings = async () => {
    const res = await fetch(`${API_BASE}/bookings`);
    return await res.json();
};