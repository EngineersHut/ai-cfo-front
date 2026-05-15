export const reportsData = [
    {
        id: 1,
        period: "Jan 2025",
        type: "Bank statements (40%)",
        status: "Processed",
        dateRange: "Jan 01 - Jan 31"
    },
    {
        id: 2,
        period: "Q1 2025",
        type: "Tax document(10%)",
        status: "Processed",
        dateRange: "Dec 01 - Dec 31"
    },
    {
        id: 3,
        period: "Dec 2025",
        type: "Income statements(10%)",
        status: "Processed",
        dateRange: "Jan 01 - Jan 31"
    },
    {
        id: 4,
        period: "Nov 2025",
        type: "Invoice(40%)",
        status: "Processed",
        dateRange: "Dec 01 - Dec 31"
    }
];

export const revenueData = [
    { name: 'Jan', revenue: 27000, netProfit: 35000 },
    { name: 'Feb', revenue: 27000, netProfit: 35000 },
    { name: 'Mar', revenue: 21000, netProfit: 28000 },
    { name: 'Apr', revenue: 21000, netProfit: 28000 },
    { name: 'May', revenue: 35000, netProfit: 25000 },
    { name: 'Jun', revenue: 35000, netProfit: 25000 },
    { name: 'Jul', revenue: 48000, netProfit: 25000 },
    { name: 'Aug', revenue: 35000, netProfit: 31000 },
    { name: 'Sep', revenue: 35000, netProfit: 31000 },
    { name: 'Oct', revenue: 25000, netProfit: 36000 },
    { name: 'Nov', revenue: 35000, netProfit: 36000 },
    { name: 'Dec', revenue: 35000, netProfit: 31000 },
];

export const expenseBreakdownData = [
    { name: 'Bank statements', value: 40, color: '#5345cc' },
    { name: 'Income statements', value: 10, color: '#f59e0b' },
    { name: 'Tax document', value: 10, color: '#84cc16' },
    { name: 'Invoice', value: 40, color: '#e11d48' },
];

export const rawTableData = [
    { category: 'Bank statements', value: '$20,000', percent: '40%', status: 'Completed', note: 'Verified and matches expected balance' },
    { category: 'Income statements', value: '$35,000', percent: '10%', status: 'Unsupported', note: 'Format not supported, needs re-upload' },
    { category: 'Tax document', value: '$12,000', percent: '10%', status: 'Completed', note: 'Successfully validated and accepted' },
    { category: 'Invoice', value: '$8,000', percent: '40%', status: 'Completed', note: 'Verified and processed successfully' },
];
