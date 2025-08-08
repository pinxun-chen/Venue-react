const GOVPAY_BASE_URL = "/GOVPayWebService/rs/mgmt";
const API_KEY = "47454e8513c842008bb6ad4b98c00709";

// 共用 headers
const headers = {
    "Content-Type": "application/json",
    "API-KEY": API_KEY,
};

// 工具：通用 POST 方法
const post = async (path, data) => {
    const response = await fetch(`${GOVPAY_BASE_URL}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`HTTP error ${response.status} - ${err}`);
    }

    return response.json();
};

// 1. 查詢支付業者
export const getPayProviders = (storeId, payCode) =>
    post("/getPaySvcProvider", { store_id: storeId, pay_code: payCode });

// 2. 建立訂單
export const createPayOrder = (payload) =>
    post("/doPay", payload);

// 3. 查詢繳費結果（用 Key）
export const getPaymentByKey = (storeId, key) =>
    post("/getPaymentByKey", { store_id: storeId, qry_key: key });

// 4. 查詢訂單狀態（用訂單編號）
export const getPaymentInquiry = (storeId, orderNo) =>
    post("/getPaymentInquiry", { store_id: storeId, order_no: String(orderNo) });

// 5. 查詢入帳資訊
export const getEntryDateList = (storeId, payCode, entryDate, payDate) =>
    post("/getEntryDateList", {
        store_id: storeId,
        pay_code: payCode,
        entry_date: entryDate,
        pay_date: payDate,
    });
