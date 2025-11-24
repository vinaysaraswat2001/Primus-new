import React, { useMemo, useState } from "react";
import bgImageds from "./bgImageds.jpg";

const MOCK_INVOICE_DATA = {
  total_amount: 1250000,
  total_invoices: 12,
  paid_invoices: 7,
  pending_invoices: 4,
  overdue_invoices: 1,
  invoices: [
    {
      documentInvoiceNo: "INV-1001",
      dueDate: "2024-10-15",
      amount: 250000,
      paymentDiscount: 5000,
      status: "completed",
      overdue: false,
      items: [
        {
          product: "Sample A",
          quantity: 5,
          discount_amount: 500,
          unit_price_lcy: 5000,
          total_amount: 25000,
          line_amount_with_vat: 26250,
        },
        {
          product: "Sample B",
          quantity: 2,
          discount_amount: 200,
          unit_price_lcy: 10000,
          total_amount: 20000,
          line_amount_with_vat: 21200,
        },
      ],
      subtotal: 45000,
      discounts_total: 700,
      net_payable: 47450,
      vendorName: "Acme Corp",
      proposal: "Consulting engagement",
    },
    {
      documentInvoiceNo: "INV-1002",
      dueDate: "2024-10-20",
      amount: 150000,
      paymentDiscount: 2000,
      status: "pending",
      overdue: false,
      items: [
        {
          product: "Product C",
          quantity: 3,
          discount_amount: 150,
          unit_price_lcy: 5000,
          total_amount: 15000,
          line_amount_with_vat: 15900,
        },
      ],
      subtotal: 15000,
      discounts_total: 150,
      net_payable: 15900,
      vendorName: "Delta Ltd.",
      proposal: "Phase 2 work",
    },
    {
      documentInvoiceNo: "INV-1003",
      dueDate: "2024-10-10",
      amount: 100000,
      paymentDiscount: 1000,
      status: "pending",
      overdue: true,
      items: [
        {
          product: "Product D",
          quantity: 1,
          discount_amount: 50,
          unit_price_lcy: 10000,
          total_amount: 10000,
          line_amount_with_vat: 10600,
        },
      ],
      subtotal: 10000,
      discounts_total: 50,
      net_payable: 10600,
      vendorName: "Zeta Pvt.",
      proposal: "PO-based billing",
    },
  ],
};

const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const toNum = (v) => {
  if (v === "" || v == null) return 0;
  const n = Number(String(v).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const AdvisoryPaymentTracking = () => {
  const [data, setData] = useState(MOCK_INVOICE_DATA);
  const [mode, setMode] = useState("dashboard");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState({
    vendorName: "",
    invoiceId: "",
    product: "",
    quantity: "",
    dueDate: "",
    unitPrice: "",
    discount: "",
    amount: "",
    incTax: "",
    proposal: "",
  });

  const handleViewClick = (invoiceNo) => {
    const invoice = data.invoices.find(
      (inv) => inv.documentInvoiceNo === invoiceNo
    );
    setSelectedInvoice(invoice || null);
    setMode("view");
  };

  const handleBackToDashboard = () => {
    setSelectedInvoice(null);
    setMode("dashboard");
  };

  const handleOpenForm = () => {
    setForm({
      vendorName: "",
      invoiceId: "",
      product: "",
      quantity: "",
      dueDate: "",
      unitPrice: "",
      discount: "",
      amount: "",
      incTax: "",
      proposal: "",
    });
    setMode("form");
  };

  const handleSubmitInvoice = () => {
    if (!form.invoiceId || !form.product || !form.quantity || !form.dueDate) {
      alert("Please fill Invoice ID, Product/Service, Quantity, and Due Date.");
      return;
    }

    const qty = Math.max(0, toNum(form.quantity));
    const unit = Math.max(0, toNum(form.unitPrice));
    const disc = Math.max(0, toNum(form.discount));
    const amt = Math.max(0, toNum(form.amount));
    const incTax = Math.max(0, toNum(form.incTax));

    const itemTotal = unit * qty;
    const itemWithTax = incTax || itemTotal;
    const subtotal = itemTotal;
    const discounts_total = disc;
    const net_payable = incTax || Math.max(0, itemTotal - disc);

    const today = new Date();
    const due = new Date(form.dueDate);
    const status = "pending";
    const overdue = due < new Date(today.toDateString()) && status !== "completed";

    const newInvoice = {
      documentInvoiceNo: form.invoiceId,
      dueDate: form.dueDate,
      amount: amt || net_payable,
      paymentDiscount: disc,
      status,
      overdue,
      items: [
        {
          product: form.product,
          quantity: qty,
          discount_amount: disc,
          unit_price_lcy: unit,
          total_amount: itemTotal,
          line_amount_with_vat: itemWithTax,
        },
      ],
      subtotal,
      discounts_total,
      net_payable,
      vendorName: form.vendorName,
      proposal: form.proposal,
    };

    const next = { ...data };
    next.invoices = [newInvoice, ...data.invoices];
    next.total_invoices = (data.total_invoices || 0) + 1;
    next.pending_invoices = (data.pending_invoices || 0) + 1;
    next.overdue_invoices =
      (data.overdue_invoices || 0) + (overdue ? 1 : 0);
    next.total_amount = (data.total_amount || 0) + (newInvoice.amount || 0);

    setData(next);
    setSelectedInvoice(newInvoice);
    setMode("view");
  };

  const Header = useMemo(
    () => (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 font-semibold text-lg">
          {mode === "dashboard" && "Invoices Overview"}
          {mode === "form" && "Submit Invoice"}
          {mode === "view" && "View Invoice Details"}
        </h2>

        {mode === "dashboard" && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <button
              onClick={handleOpenForm}
              className="cursor-pointer bg-[#102437] text-white rounded-full px-4 py-1 text-sm hover:bg-[#1b263b] transition"
            >
              Submit Invoice
            </button>
          </div>
        )}
      </div>
    ),
    [mode]
  );

  return (
    <div
      className="min-h-screen p-6 flex gap-6 bg-gradient-to-r from-yellow-50 to-amber-50 bg-no-repeat bg-center bg-cover -mt-[5rem]"
      style={{ backgroundImage: `url(${bgImageds})` }}
    >
      {/* ✅ FORM MODE */}
      {mode === "form" ? (
        <div className="mt-20 w-full">
          <div className="bg-white/90 rounded-2xl shadow-md p-6">
            {/* Top bar */}
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackToDashboard}
                className="text-black font-bold flex items-center mr-3 cursor-pointer"
                title="Back"
              >
                ←
              </button>
              <h2 className="cursor-pointer text-xl font-semibold">
                Submit Invoice
              </h2>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Advisor Name
                </label>
                <input
                  value={form.vendorName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, vendorName: e.target.value }))
                  }
                  placeholder="Anil Sharma"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Invoice ID
                </label>
                <input
                  value={form.invoiceId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, invoiceId: e.target.value }))
                  }
                  placeholder="INV-14589"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Product / Service
                </label>
                <input
                  value={form.product}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, product: e.target.value }))
                  }
                  placeholder="Enter Product / Service"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  placeholder="Enter Quantity"
                  inputMode="numeric"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Enter Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dueDate: e.target.value }))
                  }
                  className="cursor-pointer w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Unit Price
                </label>
                <input
                  value={form.unitPrice}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, unitPrice: e.target.value }))
                  }
                  placeholder="Enter Unit Price"
                  inputMode="numeric"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Discount
                </label>
                <input
                  value={form.discount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, discount: e.target.value }))
                  }
                  placeholder="Enter Discount"
                  inputMode="numeric"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="Enter Amount"
                  inputMode="numeric"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Inc. Tax
                </label>
                <input
                  value={form.incTax}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, incTax: e.target.value }))
                  }
                  placeholder="Enter Inc. Tax"
                  inputMode="numeric"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
                />
              </div>
            </div>

            {/* Proposal */}
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Proposal / Interest Statement
              </label>
              <textarea
                value={form.proposal}
                onChange={(e) =>
                  setForm((p) => ({ ...p, proposal: e.target.value }))
                }
                rows={4}
                placeholder="Enter Proposal / Interest Statement"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleBackToDashboard}
                className="cursor-pointer px-6 py-2 rounded-full bg-gray-200 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInvoice}
                className="cursor-pointer px-6 py-2 rounded-full bg-[#0d1b2a] text-white hover:bg-[#1b263b]"
              >
                Submit Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ✅ DASHBOARD MODE
        <div className="mt-20 flex flex-col md:flex-row gap-6 w-full">
          {/* LEFT CARD */}
          <div className="w-[25rem] bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-600 font-medium">Invoice Dashboard</h2>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              {currency(data.total_amount)}
            </h1>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="text-gray-600">Total Invoices</p>
                <p className="text-gray-900 font-semibold">{data.total_invoices}</p>
              </div>
              <div>
                <p className="text-gray-600">Paid Invoices</p>
                <p className="text-green-600 font-semibold">{data.paid_invoices}</p>
              </div>
              <div>
                <p className="text-gray-600">Pending Invoices</p>
                {/* <p className="text-amber-500 font-semibold">{data.pending_invoices}</p> */}
                <p className="text-amber-500 font-semibold">0</p>
              </div>
              <div>
                <p className="text-gray-600">Overdue Invoices</p>
                {/* <p className="text-red-500 font-semibold">{data.overdue_invoices}</p> */}
                <p className="text-red-500 font-semibold">0</p>
              </div>
            </div>
          </div>

          {/* RIGHT TABLE + Header */}
          <div className="flex-1 bg-white w-full rounded-2xl shadow-md p-6">
            {Header}
            <div className="h-96 overflow-y-auto">
              <table className="w-full bg-white text-left text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-2">Invoice No</th>
                    <th className="px-2">Due Date</th>
                    <th className="px-2">Total Amount</th>
                    {/* <th className="px-2">Discount</th> */}
                    <th className="px-2">Status</th>
                    <th className="px-2">Detail View</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv) => (
                    <tr key={inv.documentInvoiceNo} className="bg-gray-50 hover:bg-gray-100 rounded-xl">
                      <td className="px-2 py-2 font-medium">{inv.documentInvoiceNo}</td>
                      <td className="px-2 py-2 font-medium">{inv.dueDate}</td>
                      <td className="px-2">{currency(inv.amount)}</td>
                      {/* <td className="px-2">{currency(inv.paymentDiscount)}</td> */}
                      <td className="px-2">
                        {inv.status === "completed" && (
                          <span className="text-green-600 font-medium">● Completed</span>
                        )}
                        {inv.status === "pending" && (
                          <span className="text-green-600 font-medium">● Completed</span>
                        )}
                      </td>
                      <td
                        className="px-2 text-amber-600 font-semibold cursor-pointer"
                        onClick={() => handleViewClick(inv.documentInvoiceNo)}
                      >
                        View
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisoryPaymentTracking;
