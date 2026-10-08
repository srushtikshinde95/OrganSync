# 🫀 OrganSync – Efficient Donor–Recipient Matching

> **A Data-Structure-Driven Biomedical Organ Matching & Surgical Allocation Engine**
> Built as an advanced Computer Science course project demonstration.

---

## 📌 Project Overview

**OrganSync** is a full-stack educational web application designed to demonstrate the real-world application of foundational computer science **Data Structures and Algorithms (DSA)** to solve the multi-constrained problem of **human donor organ allocation and recipient matching**.

In real-world biomedical logistics, organs such as hearts, lungs, kidneys, and livers have strict **cold-ischemic shelf lives** (e.g., hearts must be transplanted within 4–6 hours). Meanwhile, thousands of patients await life-saving grafts under varying clinical urgency tiers (Status 1A, Status 1B, Status 2, Status 3).

OrganSync utilizes **Hash Tables**, **Priority Queues (Binary Heaps)**, **Weighted Bipartite Graphs**, and **First-In First-Out (FIFO) Queues** to:
1. Guarantee **$O(1)$** instant entity lookup by alphanumeric identifier.
2. Prioritize **critical recipients** and **expiring grafts** dynamically in **$O(\log N)$** time.
3. Model biomedical compatibility as a **Weighted Bipartite Graph** and solve **Maximum Weight Bipartite Matching** to maximize allocation utility.
4. Enforce strict **1-to-1 uniqueness constraints** (each organ assigned to $\le 1$ recipient, each recipient receiving $\le 1$ organ).
5. Manage surgical preparation and courier logistics sequentially via a **FIFO Queue**.

> ⚠️ **Educational Disclaimer**: OrganSync is developed purely for academic and computer science curriculum demonstration purposes. It does not replace clinical decision support systems, UNOS/OPTN policies, or medical protocols.

---

## 🏗️ Core Data Structure Mapping

| Data Structure | Implementation | Purpose in OrganSync | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Hash Table** | `src/dsa/HashTable.ts` | Stores Donor Organs & Recipients for instant key lookup by ID (`ORG-101`, `REC-201`). Employs polynomial rolling string hashing with separate chaining and dynamic resizing on load factor $\alpha > 0.75$. | **$O(1)$** Avg Lookup, Insert, Delete | **$O(N)$** |
| **Priority Queue / Binary Heap** | `src/dsa/PriorityQueue.ts` | **Recipient Max-Heap**: Prioritizes Status 1A/1B patients and waitlist tenure.<br>**Organ Min-Heap**: Prioritizes grafts with lowest remaining cold-ischemia hours. | **$O(\log N)$** Push / Pop<br>**$O(1)$** Peek Root | **$O(N)$** (Contiguous Array) |
| **Weighted Bipartite Graph** | `src/dsa/BipartiteGraph.ts` | Models compatibility network where Partition $U$ represents Organs and Partition $V$ represents Recipients. Edges exist only if biological criteria (ABO, organ type, active status) are met. Edge weights $w(u, v) \in [0, 100]$ represent compatibility scores. | **$O(\|U\| \times \|V\|)$** Edge Construction | **$O(V + E)$** (Adjacency List) |
| **Matching Engine** | `src/dsa/MatchingEngine.ts` | Greedy Maximum Weight Bipartite Matching with conflict resolution. Sorts candidate edges and greedily locks non-conflicting optimal pairs. | **$O(E \log E)$** Candidate Sort + Greedy Assign | **$O(V + E)$** |
| **FIFO Queue** | `src/dsa/FIFOQueue.ts` | Manages sequential dispatch and surgical operating room preparation for accepted matches through a 5-stage state machine. | **$O(1)$** Enqueue / Dequeue | **$O(N)$** (Linked List) |

---

## 🧮 Multi-Factor Compatibility Scoring Formula

The compatibility score between Donor Organ $u$ and Recipient $v$ is computed on a **0 to 100 point scale**:

$$\text{Score}(u, v) = \text{BloodBaseline} + \text{HLA\_Score} + \text{Urgency\_Score} + \text{ShelfLife\_Boost} + \text{Waitlist\_Score} + \text{Distance\_Score} + \text{Age\_Score}$$

### 1. Biological Hard Filters (Strict Eligibility)
- **Exact Organ Match**: Organ type must match required organ exactly (e.g. Heart $\rightarrow$ Heart).
- **ABO Blood Compatibility**:
  - $O^-$ is Universal Donor (can donate to all).
  - $AB^+$ is Universal Recipient (can receive from all).
  - Incompatible blood groups yield **0 score** and produce **no graph edge**.
- **Cold-Ischemia Shelf Life**: Organ must have remaining viability ($> 0\text{ hours}$).

### 2. Multi-Factor Point Weights
- **ABO Compatibility Baseline**: $+15\text{ pts}$
- **HLA Antigen Match** (HLA-A, HLA-B, HLA-DR): Up to $+25\text{ pts}$ (HLA-DR locus weighted $1.5\times$).
- **Clinical Urgency Tier**:
  - **Status 1A (Critical - ECMO / Shock)**: $+30\text{ pts}$
  - **Status 1B (Urgent - Inotropes)**: $+20\text{ pts}$
  - **Status 2 (Moderate)**: $+10\text{ pts}$
  - **Status 3 (Stable)**: $+5\text{ pts}$
- **Cold-Ischemia Urgency Boost**: Organs nearing expiry ($< 25\%$ shelf-life left) receive up to $+15\text{ pts}$ to prevent wastage.
- **Waitlist Tenure**: Logarithmic bonus up to $+10\text{ pts}$ based on days on the national waitlist.
- **Geographic Distance**: Haversine distance calculation between donor hospital and recipient hospital:
  - $\le 50\text{ km}$: $+10\text{ pts}$
  - $\le 200\text{ km}$: $+8\text{ pts}$
  - $\le 500\text{ km}$: $+6\text{ pts}$
  - $\le 1000\text{ km}$: $+4\text{ pts}$
  - $> 1000\text{ km}$: $+2\text{ pts}$
- **Age Compatibility Bracket**: Up to $+5\text{ pts}$.

---

## 🚀 Key Features & Pages

1. **Overview / Landing Page**:
   - System introduction, real-time telemetry KPI cards, 4 DSA feature cards with deep-dives, and end-to-end matching pipeline flowchart.
2. **Clinical Operations Dashboard**:
   - Live KPI cards, emergency alerts for expiring organs ($< 4\text{h}$) and Status 1A patients, supply vs. demand breakdown charts, and active transport pipeline.
3. **Donor Organs Registry**:
   - Add, edit, delete, search, and multi-filter organs by type, blood group, availability, and shelf life.
   - Live **Hash Table bucket distribution diagram** showing load factor and collision statistics.
4. **Waiting Recipients Registry**:
   - Manage waiting patient directory with clinical urgency badges, PRA sensitization percentage, HLA alleles, and waitlist tenure.
5. **Matching Engine**:
   - Interactive **"Generate Matches"** execution with adjustable minimum threshold slider.
   - Comprehensive match cards showing score decomposition bars, recommendation reasons, and Accept/Reject actions.
   - Step-by-step algorithm audit logs explaining conflicts and assignments.
6. **Compatibility Graph Visualizer**:
   - Interactive SVG Bipartite Graph canvas connecting Partition $U$ (Organs) to Partition $V$ (Recipients).
   - Color-coded edges: **Strong** ($\ge 80$), **Medium** ($60-79$), **Weak** ($40-59$), with **Optimal 1-to-1 matches glowing in teal**.
7. **Priority Queue & Binary Heap Visualizer**:
   - Complete Binary Tree topology and contiguous RAM array buffer inspector (`[i]`, `[2i+1]`, `[2i+2]`).
   - Toggle between **Recipient Max-Heap** and **Organ Expiry Min-Heap**.
8. **Transplant Transport Queue**:
   - 5-Stage Kanban pipeline: `Match Accepted` $\rightarrow$ `Transport Scheduled` $\rightarrow$ `In Transit` $\rightarrow$ `Transplant Ready` $\rightarrow$ `Completed`.
   - Courier vehicle indicators (Emergency Air Ambulance, Medical Jet, High-Speed Ground Ambulance).
9. **DSA & Algorithm Documentation Guide**:
   - Theoretical explanations, LaTeX mathematical formulas, interactive calculation sandbox, and Big-O asymptotic matrix.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Testing**: Vitest (Automated unit testing suite for all DSA modules).
- **Bundler & Tooling**: Vite 6, PostCSS, Autoprefixer.
- **State & Storage**: React Context API with LocalStorage state persistence and sample dataset reseed capability.

---

## 💻 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### Quick Start

1. **Clone or navigate to the project directory**:
   ```bash
   cd organsync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run automated unit tests**:
   ```bash
   npm run test # or: npx vitest run
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173/` (or the URL displayed in your terminal).

---

## 🧪 Automated Unit Tests

OrganSync comes with a comprehensive test suite in `src/dsa/__tests__/dsa.test.ts` verifying:
- ✅ **Hash Table**: Insertion, retrieval, collision handling via separate chaining, deletion, and load factor calculation.
- ✅ **Priority Queue**: Max-heap ordering for urgent recipients and min-heap ordering for expiring organs.
- ✅ **Biomedical Compatibility**: ABO blood compatibility matrix ($O^-$ universal donor, $AB^+$ universal recipient) and organ type strict validation.
- ✅ **Bipartite Matching**: Strict 1-to-1 matching uniqueness constraint (no organ or recipient matched more than once).
- ✅ **FIFO Queue**: Exact sequential First-In First-Out enqueue and dequeue behavior.

To run tests:
```bash
npx vitest run
```

---

## 🔮 Future Enhancements

- Integration of the Hungarian Algorithm ($O(V^3)$ Kuhn-Munkres) for exact optimal weighted maximum bipartite matching.
- Real-time GPS WebSocket tracking for transplant transport aircraft.
- Crossmatch virtual HLA antibody donor-specific antibody (DSA) mean fluorescence intensity (MFI) simulation.
