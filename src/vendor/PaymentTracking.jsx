import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoiceData,
  fetchInvoiceLines,
  clearSelectedInvoice,
  submitInvoice,
  resetSubmitState,
} from "../redux/invoiceSlice"; // ✅ adjust import path
import bgImageds from "./bgImageds.jpg";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AUTH_TOKEN = localStorage.getItem("authToken");
const ORGANIZER_EMAIL = "garvit.dang@onmeridian.com";

const PaymentTracking = () => {
  const dispatch = useDispatch();

  const { data: invoiceData, selectedInvoice, loading, error, submitSuccess } =
    useSelector((state) => state.invoices);

  // Local state
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter invoices by invoice number or status
  const filteredInvoices = useMemo(() => {
    if (!invoiceData?.invoices) return [];
    return invoiceData.invoices.filter((inv) => {
      const search = searchTerm.toLowerCase();
      return (
        inv.documentInvoiceNo?.toLowerCase().includes(search) ||
        inv.status?.toLowerCase().includes(search)
      );
    });
  }, [invoiceData, searchTerm]);

  const deriveVendorNameFromEmail = (email) => {
    if (!email) return "";
    try {
      const local = email.split("@")[0] || "";
      const cleaned = local.replace(/[\._-]+/g, " ").trim();
      return cleaned
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    } catch {
      return "";
    }
  };

  const defaultVendorName = useMemo(
    () => `${deriveVendorNameFromEmail(ORGANIZER_EMAIL) || "Vendor"}`,
    []
  );

  const [submitForm, setSubmitForm] = useState({
    vendor_name: defaultVendorName,
    invoice_id: "",
    product_service: "",
    quantity: "",
    due_date: "",
    unit_price: "",
    discount: "",
    inc_tax: "",
    amount: "",
    proposal: "",
  });

  useEffect(() => {
    const qty = Number(submitForm.quantity) || 0;
    const unit = Number(submitForm.unit_price) || 0;
    const discount = Number(submitForm.discount) || 0;
    const incTax = Number(submitForm.inc_tax) || 0;
    const computed = qty * unit - discount + incTax;
    setSubmitForm((prev) => ({
      ...prev,
      amount: Number.isFinite(computed) ? computed.toFixed(2) : "",
    }));
  }, [submitForm.quantity, submitForm.unit_price, submitForm.discount, submitForm.inc_tax]);

  const handleSubmitFormChange = (e) => {
    const { name, value } = e.target;
    setSubmitForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fetch invoices only if not already present
  useEffect(() => {
    if (!invoiceData || !invoiceData.invoices || invoiceData.invoices.length === 0) {
      dispatch(fetchInvoiceData());
    }
  }, [dispatch, invoiceData]);


  const handleViewClick = (invoiceNo) => {
    dispatch(fetchInvoiceLines(invoiceNo));
  };

  const handleBackClick = () => dispatch(clearSelectedInvoice());

  const handleSubmitInvoice = async () => {
    if (
      !submitForm.invoice_id ||
      !submitForm.product_service ||
      !submitForm.quantity ||
      !submitForm.unit_price ||
      !submitForm.due_date
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const payload = {
      vendor_email: ORGANIZER_EMAIL,
      vendor_name: submitForm.vendor_name,
      invoice_id: submitForm.invoice_id,
      product_or_service: submitForm.product_service,
      quantity: Number(submitForm.quantity),
      due_date: submitForm.due_date,
      unit_price: Number(submitForm.unit_price),
      discount: Number(submitForm.discount || 0),
      amount: Number(submitForm.amount || 0),
      inc_tax: Number(submitForm.inc_tax || 0),
      proposal_interest_statement: submitForm.proposal,
    };

    setSubmitting(true);
    await dispatch(submitInvoice(payload));
    setSubmitting(false);
  };

  // ✅ Refresh dashboard after successful submit
  useEffect(() => {
    if (submitSuccess) {
      alert("Invoice submitted successfully!");
      setShowSubmitForm(false);
      dispatch(fetchInvoiceData());
      dispatch(resetSubmitState());
    }
  }, [submitSuccess, dispatch]);

  if (loading && (!invoiceData || !invoiceData.invoices || invoiceData.invoices.length === 0))
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-100 rounded-lg mt-8"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error: {error}
      </div>
    );

  if (!invoiceData)
    return <div className="text-center text-gray-500 mt-10">No data available</div>;

  return (
    <div
      className="min-h-screen p-6 flex gap-6 bg-gradient-to-r from-yellow-50 to-amber-50 bg-no-repeat bg-center bg-cover -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      {/* Submit Invoice Form view */}
      {showSubmitForm ? (
        <div className="mt-20 w-full">
          <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowSubmitForm(false)}
                className="text-black font-bold flex items-center mr-1 cursor-pointer"
              >
                ←
              </button>
              <h2 className="text-xl font-semibold">Submit Invoice</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p>Vendor Name</p>
                <input
                  type="text"
                  name="vendor_name"
                  value={submitForm.vendor_name}
                  onChange={handleSubmitFormChange}
                  placeholder="Vendor Name"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <p>Invoice ID</p>
                <input
                  type="text"
                  name="invoice_id"
                  value={submitForm.invoice_id}
                  onChange={handleSubmitFormChange}
                  placeholder="Invoice ID"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                Product / Service
                <input
                  type="text"
                  name="product_service"
                  value={submitForm.product_service}
                  onChange={handleSubmitFormChange}
                  placeholder="Enter Product / Service"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                Quantity
                <input
                  type="number"
                  name="quantity"
                  value={submitForm.quantity}
                  onChange={handleSubmitFormChange}
                  placeholder="Enter Quantity"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                  min={0}
                />
              </div>

              <div className="relative">
                Enter Due Date
                <input
                  type="date"
                  name="due_date"
                  value={submitForm.due_date}
                  onChange={handleSubmitFormChange}
                  placeholder="Enter Due Date"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                />
                {/* If you want a calendar icon, you can place it absolutely here */}
              </div>

              <div>
                Unit Price
                <input
                  type="number"
                  step="0.01"
                  name="unit_price"
                  value={submitForm.unit_price}
                  onChange={handleSubmitFormChange}
                  placeholder="Enter Unit Price"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                Discount
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={submitForm.discount}
                  onChange={handleSubmitFormChange}
                  placeholder="Enter Discount"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                Amount
                <input
                  type="text"
                  name="amount"
                  value={submitForm.amount}
                  readOnly
                  placeholder="Enter Amount"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                Inc. Tax
                <input
                  type="number"
                  step="0.01"
                  name="inc_tax"
                  value={submitForm.inc_tax}
                  onChange={handleSubmitFormChange}
                  placeholder="Enter Inc. Tax"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                  min={0}
                />
              </div>

              <div className="md:col-span-4">
                Proposal / Interest Statement
                <textarea
                  name="proposal"
                  value={submitForm.proposal}
                  onChange={handleSubmitFormChange}
                  rows={5}
                  placeholder="Enter Proposal / Interest Statement"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setShowSubmitForm(false)}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInvoice}
                disabled={submitting}
                className="px-6 py-2 rounded-full bg-[#102437] text-white hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Invoice"}
              </button>
            </div>
          </div>
        </div>
      ) : selectedInvoice ? (
        <div className="mt-20 w-full flex flex-col md:flex-row gap-6">
          {/* LEFT SECTION - Line Items */}
          <div className="w-[120rem] bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackClick}
                className="text-black font-bold flex items-center mr-4 cursor-pointer"
              >
                ←
              </button>
              <h2 className="text-lg font-semibold mr-4">View Invoice Details</h2>
            </div>

            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-2">Product</th>
                  <th className="px-2">Quantity</th>
                  <th className="px-2">Discount</th>
                  <th className="px-2">Unit Price</th>
                  <th className="px-2">Amount</th>
                  <th className="px-2">Inc. Tax</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx} className="bg-gray-50 hover:bg-gray-100 rounded-xl">
                    <td className="px-2 py-2 font-medium">{item.product}</td>
                    <td className="px-2">{item.quantity}</td>
                    <td className="px-2">₹{item.discount_amount}</td>
                    <td className="px-2">{item.unit_price_lcy}</td>
                    <td className="px-2">{item.total_amount}</td>
                    <td className="px-2">₹{item.line_amount_with_vat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT SECTION - Invoice Summary */}
          <div className="w-full flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Invoice No</p>
                  <p className="text-gray-900 font-semibold">{selectedInvoice.documentNo}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Subtotal</p>
                  <p className="text-gray-900 font-semibold">{selectedInvoice.subtotal}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Discount</p>
                  <p className="text-gray-900 font-semibold">{selectedInvoice.discounts_total}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Net Payable</p>
                  <p className="text-gray-900 font-semibold">{selectedInvoice.net_payable}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default Dashboard View */
        <div className="mt-20 flex flex-col md:flex-row gap-6 w-full">
          {/* LEFT CARD */}
          <div className="w-[25rem] bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-gray-600 font-medium">Totall Invoice Value</h2>
              <button className="text-gray-400 hover:text-gray-600">⋮</button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              ₹{invoiceData.total_amount?.toLocaleString()}
            </h1>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="text-gray-600">Total Invoices</p>
                <p className="text-gray-900 font-semibold">{invoiceData.total_invoices}</p>
              </div>
              <div>
                <p className="text-gray-600">Paid Invoices</p>
                <p className="text-green-600 font-semibold">{invoiceData.paid_invoices}</p>
              </div>
              <div>
                <p className="text-gray-600">Pending Invoices</p>
                <p className="text-amber-500 font-semibold">{invoiceData.pending_invoices}</p>
              </div>
              <div>
                <p className="text-gray-600">Overdue Invoices</p>
                <p className="text-red-500 font-semibold">{invoiceData.overdue_invoices}</p>
              </div>
            </div>
          </div>

          {/* RIGHT TABLE */}
          <div className="flex-1 bg-white w-full rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-800 font-semibold text-lg">View Invoice Details</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search Invoice No..."
                  className="border rounded-full px-4 py-1 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="cursor-pointer bg-[#102437] text-white rounded-full px-4 py-1 text-sm"
                  onClick={() => setShowSubmitForm(true)}
                >
                  Submit Invoice
                </button>
              </div>
            </div>

            <div
              className="h-99 overflow-y-auto"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE & Edge
              }}
            >
              <table className="w-full bg-white text-left text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-2">Invoice No</th>
                    <th className="px-2">Due Date</th>
                    <th className="px-2">Total Amount</th>
                    <th className="px-2">Discount</th>
                    <th className="px-2">Status</th>
                    <th className="px-2">Detail View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.documentInvoiceNo} className="bg-gray-50 hover:bg-gray-100 rounded-xl">
                        <td className="px-2 py-2 font-medium">{inv.documentInvoiceNo}</td>
                        <td className="px-2 py-2 font-medium">{inv.dueDate}</td>
                        <td className="px-2">₹{inv.amount}</td>
                        <td className="px-2">₹{inv.paymentDiscount}</td>
                        <td className="px-2">
                          {inv.status === "completed" && (
                            <span className="text-green-600 font-medium">● Completed</span>
                          )}
                          {inv.status === "pending" && (
                            <span className="text-amber-500 font-medium">● Pending</span>
                          )}
                          {inv.overdue && <span className="text-red-500 font-medium">● Overdue</span>}
                        </td>
                        <td
                          className="px-2 text-amber-600 font-semibold cursor-pointer"
                          onClick={() => handleViewClick(inv.documentInvoiceNo)}
                        >
                          View
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-4">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTracking;