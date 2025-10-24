# BleuLink Design Guidelines
## Digital Monitoring System for Raw and Mixed Coolant Consumption

### Design Approach
**Selected Framework**: Enterprise Dashboard System (inspired by Carbon Design & Fluent Design)
- **Rationale**: Industrial monitoring application requiring data density, clarity, and operational efficiency
- **Key Principle**: Form follows function - every element serves a clear purpose in monitoring coolant consumption
- **Aesthetic Direction**: Formal, professional industrial interface per user specification

---

## Typography System

**Font Selection**:
- Primary: Inter or IBM Plex Sans (professional, highly legible for data)
- Monospace: IBM Plex Mono (for numerical values, machine IDs)

**Hierarchy**:
- Dashboard Title: 2xl, semibold (Machine Overview, System Alerts)
- Section Headers: xl, semibold (Live Metrics, Usage Trends)
- Card Titles: lg, medium (Machine CNC-001, Coolant Status)
- Data Labels: sm, medium, uppercase tracking-wide (FLOW RATE, MIX RATIO)
- Primary Values: 3xl-4xl, bold (numerical readings: 85.2L, 62.5%)
- Secondary Text: base, regular (descriptions, timestamps)
- Micro Text: xs, regular (footnotes, units of measurement)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing (p-2, gap-2): Between related data points
- Component padding (p-4, p-6): Card interiors, button padding
- Section spacing (p-8, gap-8): Between dashboard sections
- Major spacing (p-12, p-16): Page margins, header/footer padding

**Grid Structure**:
- Dashboard Layout: 12-column grid with 24-column option for dense data
- Primary Content: max-w-7xl centered container
- Sidebar (if used): Fixed 64 (w-64) or 80 (w-80) width

**Responsive Breakpoints**:
- Mobile (base): Single column, stacked metrics
- Tablet (md): 2-column grid for machine cards
- Desktop (lg): 3-4 column grid, side-by-side comparisons
- Large Desktop (xl): Full dashboard with multi-panel layouts

---

## Component Library

### 1. Dashboard Header
- Full-width sticky header (h-16)
- Left: BleuLink logo/brand + current plant/location
- Center: Global search and machine filter
- Right: User role badge, notification bell (alert count), user avatar
- Bottom border for visual separation

### 2. Status Gauges (Primary Monitoring Element)
**Circular Gauge Cards**:
- Card dimensions: Square aspect ratio, min 200px
- Gauge: SVG-based circular progress (270-degree arc)
- Center: Large numerical value (85.2%) + small unit label
- Below gauge: Status text ("Normal Operation" / "Low Level")
- Top of card: Machine ID (CNC-001) + small live indicator dot
- Bottom: Last updated timestamp (xs text)
- Shadow: subtle elevation for card depth

**Linear Progress Bars** (alternative for compact views):
- Full-width bars with rounded ends (rounded-full)
- Height: h-3 for primary, h-2 for secondary metrics
- Label above: metric name + current value
- Percentage indicator at end of bar

### 3. Data Visualization Charts
**Line Charts** (24-hour usage trends):
- Card container with p-6 padding
- Chart header: Metric name, time range selector (24h/7d/30d tabs)
- Chart area: min-height 300px, responsive width
- Grid lines: subtle, horizontal only
- Axis labels: clear timestamps (x) and units (y)
- Tooltip on hover: precise values, formatted timestamps
- Legend: positioned top-right, horizontal layout

**Bar Charts** (shift comparison, machine comparison):
- Similar card structure as line charts
- Grouped bars for multi-metric comparison (raw vs mixed coolant)
- Value labels above bars for clarity

### 4. Alert Panel
**Alert List Component**:
- Fixed sidebar (w-80) or collapsible panel
- Header: "System Alerts" + count badge + "Mark All Read" button
- Alert items: Stacked list with gap-2
- Each alert card:
  - Icon (alert type indicator) + machine ID
  - Alert message (medium weight, base size)
  - Timestamp (xs, muted)
  - Severity indicator stripe on left edge
  - Dismiss button (×) on right
- Scrollable container (max-h-96, overflow-y-auto)
- Empty state: Icon + "No active alerts"

### 5. Machine Card Grid
**Individual Machine Cards**:
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Card structure (p-6 padding):
  - Header row: Machine ID (lg, semibold) + status badge
  - Main gauge: Large circular gauge showing mixed coolant level
  - Metrics row (grid-cols-2, gap-4):
    - Raw coolant level (value + label)
    - Flow rate (value + label)
    - Mix ratio (value + indicator)
    - Time to refill (predictive)
  - Footer: "View Details" link button
- Card hover: slight shadow increase (transition-shadow)

### 6. Data Tables
**Machine Readings History**:
- Table header: Sticky (sticky top-0), background treatment
- Columns: Machine ID | Timestamp | Raw Level | Mixed Level | Flow Rate | Mix Ratio | Actions
- Column alignment: Left for text, right for numbers
- Row height: h-12 for comfortable scanning
- Zebra striping for readability (odd/even rows)
- Pagination: Bottom-aligned, 10/25/50 rows per page
- Export button: Top-right of table container

### 7. Forms & Controls
**Filter Controls**:
- Horizontal layout with gap-4
- Dropdown selects: h-10, rounded-md, border
- Date range picker: Dual input fields with calendar icon
- Search input: h-10, rounded-md, with search icon prefix
- Apply/Reset buttons: Positioned at end of filter row

**Input Fields** (manual refill entry):
- Label: Small caps, tracking-wide, mb-2
- Input: h-10, rounded-md, border, focus ring
- Helper text: xs, mt-1 (e.g., "Enter value in liters")
- Error state: Border treatment + error message below

**Buttons**:
- Primary action: h-10, px-6, rounded-md, font-medium
- Secondary action: Same size, outlined style
- Icon buttons: Square (h-10 w-10), rounded-md
- Button groups: Joined with border between (rounded corners on ends only)

### 8. Navigation
**Top Navigation** (if multi-page):
- Horizontal tabs below header
- Tab items: px-6 py-3, uppercase tracking-wide (text-sm)
- Active indicator: Bottom border (border-b-2)

**Sidebar Navigation** (if used):
- Fixed left sidebar (w-64)
- Logo at top (p-6)
- Nav items: Stacked list with gap-1
  - Item: px-4 py-3, rounded-md, flex items-center
  - Icon (size-5) + label (ml-3)
  - Active state: background treatment
- Collapse toggle at bottom

### 9. Role-Based UI Elements
**User Role Indicator**:
- Badge component in header
- Text: Role name (OPERATOR / SUPERVISOR / MANAGER)
- Small size (px-3 py-1), rounded-full, uppercase

**Conditional Components**:
- Operator: View-only metrics, submit refill logs
- Supervisor: Access to alerts, basic reports
- Manager: Full analytics, export, system settings

### 10. Modal Overlays
**Alert Detail Modal**:
- Backdrop: Semi-transparent overlay
- Modal: max-w-2xl, centered, rounded-lg, p-6
- Header: Title (xl) + close button (×)
- Content: Scrollable if needed (max-h-96)
- Footer: Action buttons right-aligned

---

## Dashboard Layouts

### Main Dashboard View
**3-Section Layout**:
1. **Top Section** (h-auto, py-6):
   - Summary cards grid (4 columns on xl)
   - Cards: Total machines, Active alerts, Today's usage, Low coolant count
   - Each card: Icon + large value + label + trend indicator

2. **Middle Section** (flex-1):
   - Split view: 2/3 main content, 1/3 alert sidebar
   - Main: Machine grid OR selected machine detail
   - Sidebar: Live alerts + upcoming maintenance

3. **Bottom Section** (optional):
   - Full-width chart showing plant-wide trends
   - Collapsible to save space

### Machine Detail View
**Single Machine Focus**:
- Header: Machine ID + breadcrumb navigation + back button
- Hero metrics: 3-column grid with large gauges
- Chart section: Tabbed interface (Usage | Flow Rate | Mix Ratio)
- History table: Last 100 readings with filtering
- Action panel: Refill log button, maintenance schedule

---

## Spacing & Density Guidelines

**Card Density**:
- Standard cards: p-6 padding, gap-6 between sections
- Compact cards (mobile): p-4 padding, gap-4 between sections
- Data-dense tables: Minimal padding (p-2 on cells)

**Vertical Rhythm**:
- Section spacing: mb-8 between major sections
- Card spacing: gap-6 in grids
- List items: gap-2 for tight lists, gap-4 for spacious

---

## Accessibility & Usability

**Touch Targets**: Minimum 44px (h-11) for all interactive elements
**Focus States**: Clear focus rings (ring-2) on all keyboard-navigable elements
**Loading States**: Skeleton screens for gauges, shimmer effect for tables
**Empty States**: Centered icon + message for no data scenarios
**Error States**: Inline validation, clear error messages with icons

---

## Animation Principles

**Minimal Animation Strategy**:
- Gauge updates: Smooth number transitions (0.3s ease)
- Chart updates: Subtle line drawing (0.5s ease)
- Page transitions: None (instant navigation)
- Hover states: Subtle shadow/scale (0.15s ease)
- Alert appearances: Slide-in from right (0.2s ease-out)

**Performance Priority**: Avoid animations on data-heavy components

---

## Images

**No hero images required** - this is a utility dashboard application. Focus on data visualization and functional clarity.

**Optional Icons/Illustrations**:
- Empty state illustrations: Simple line art for "No machines found", "No alerts"
- Machine type icons: Small SVG icons to identify machine categories (if applicable)
- Tutorial overlays: Screenshot-based onboarding (optional for complex features)

All icons: Use Heroicons (outline style for navigation, solid for status indicators)