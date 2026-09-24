 # Product Management Admin Dashboard

A full-stack, responsive Product Management Admin Dashboard built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Lucide Icons**. This dashboard provides real-time search, category filtering, server-side dynamic pagination, and full CRUD operations for managing product inventories.

---

## 🚀 Features

- **Dynamic Data Table & Card Layout:** Responsive UI displaying products in a table view on desktop and card layout on mobile.
- **Server-Side Pagination & Limits:** Seamlessly navigate across pages and change items per page (10, 20, 50).
- **Search & Debounce:** Fast real-time search optimized with a 400ms debounce hook to minimize API overload.
- **Multi-Filter & Sorting:** Filter products by category and sort by field and ascending/descending order.
- **Full CRUD Operations:** Modals for adding new products, editing existing entries, and confirming deletions.
- **Authentication Guard:** Protected route pattern verifying authentication tokens (`js-cookie`).
- **Resilient Network Layer:** Integrated `AbortController` to cancel stale/outdated pending network requests during fast user typing or tab switching.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State & Utils:** React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`), `js-cookie`, custom `useDebounce` hook

---

## ⚙️ Getting Started Locally

### Prerequisites

Make sure you have Node.js (v18.x or later) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ShaziyaKhanam888/Product-Admin_Dasboard.git](https://github.com/ShaziyaKhanam888/Product-Admin_Dasboard.git)
   cd Product-Admin_Dasboard
