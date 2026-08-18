Buat sebuah website direktori sederhana untuk **menyimpan, mengelompokkan, dan membuka kembali website, tools, dokumentasi, design resources, AI tools, SaaS, dan repository GitHub berdasarkan fungsi masing-masing**.

Website ini bukan marketplace, bukan review platform, dan tidak perlu sistem kompleks. Fokus utamanya adalah menjadi **personal tools library / bookmark manager visual**.

## Konsep Utama

Saya mempunyai banyak link seperti:

```text
https://github.com/garrytan/gstack
https://www.tasteskill.dev/docs
https://github.com/Leonxlnx/taste-skill
https://github.com/pmndrs/react-three-fiber

https://shadergradient.co/
https://www.typeui.sh/design-skills
https://animmasterlib.dev/
https://grok.com/imagine
https://hermes-agent.nousresearch.com/docs/skills/
https://railway.com/
https://www.twilio.com/en-us
https://posthog.com/
https://sentry.io/welcome/
https://paper.design/docs/mcp#overview
https://animations.dev/
https://emilkowal.ski/skill
https://baserow.io/
https://nextcloud.com/
https://dribbble.com/
https://godly.design/
https://skiper-ui.com/v1/skiper77
https://bklit.com/docs/components/gauge-chart
https://ui.shadcn.com/
https://getdesign.md/
https://styles.refero.design/
https://penpot.app/
https://sticky.ui8.dev/
https://goodui.org/
https://designspells.com/
https://21st.dev/
https://ui.aceternity.com/
https://www.better-t-stack.dev/
https://www.useplunk.com/
https://www.skills.sh/
https://namethatui.com/
https://excalidraw.com/
https://draw.io/
https://app.cal.com/
https://openseo.so/
https://openworklabs.com/
https://vibeui.online/
```

Saya ingin semuanya tersusun rapi berdasarkan fungsi.

# Tujuan Website

Website harus menjawab kebutuhan sederhana:

> "Saya pernah menemukan tools untuk animasi UI, tapi lupa namanya."

Pengguna cukup membuka kategori:

```text
Design
→ Animation
```

Lalu semua tools terkait muncul.

Atau:

```text
Development
→ Deployment
```

Lalu muncul Railway dan tools deployment lainnya.

---

# Struktur Kategori

Gunakan kategori utama seperti:

## Design

Subkategori:

- UI Inspiration
- UI Components
- Animation
- Typography
- Color
- Gradient
- Icons
- Drawing
- Wireframe
- Design System
- Design Skills
- UI Patterns

Contoh:

```text
Shader Gradient
Category: Design
Subcategory: Gradient

21st.dev
Category: Design
Subcategory: UI Components

Aceternity UI
Category: Design
Subcategory: UI Components

shadcn/ui
Category: Design
Subcategory: UI Components

Animations.dev
Category: Design
Subcategory: Animation

Godly
Category: Design
Subcategory: Inspiration

Dribbble
Category: Design
Subcategory: Inspiration

Penpot
Category: Design
Subcategory: Design Tool

Excalidraw
Category: Design
Subcategory: Drawing
```

---

## Development

Subkategori:

- Frontend
- Backend
- Framework
- Library
- Database
- Deployment
- Monitoring
- Analytics
- Authentication
- Email
- API
- Testing
- DevTools

Contoh:

```text
React Three Fiber
Development
→ Library / 3D

Railway
Development
→ Deployment

PostHog
Development
→ Analytics

Sentry
Development
→ Monitoring

Baserow
Development
→ Database

Better-T-Stack
Development
→ Project Starter
```

---

## AI

Subkategori:

- AI Tools
- AI Agents
- AI Skills
- Image Generation
- Coding
- Prompting
- MCP

Contoh:

```text
Grok Imagine
AI
→ Image Generation

Hermes Agent Skills
AI
→ Agent Skills

skills.sh
AI
→ Skills

Taste Skill
AI
→ Skills

Paper MCP
AI
→ MCP
```

---

## GitHub Repository

Repository GitHub juga harus tetap memiliki kategori fungsi.

Contoh:

```text
garrytan/gstack

Type:
GitHub Repository

Category:
Development

Subcategory:
Developer Tools
```

Repository tidak perlu dipisahkan sepenuhnya dari kategori utamanya.

Gunakan field:

```text
Type:
Website
GitHub Repository
Documentation
SaaS
Library
Resource
Tool
```

---

# Tampilan Homepage

Homepage harus sangat sederhana.

Bagian atas:

```text
My Tools
```

atau nama yang mudah diganti.

Di bawahnya terdapat search bar besar:

```text
Search tools...
```

Di bawah search terdapat kategori:

```text
All

Design

Development

AI

GitHub

Productivity

Business

Utilities
```

Kemudian tampilkan card semua tools.

---

# Tampilan Card

Setiap website ditampilkan sebagai card visual.

Card harus menampilkan:

```text
[Logo / Favicon]

Shader Gradient

Beautiful animated gradients for websites.

Design
Gradient

shadergradient.co

[Open]
```

Card minimal mempunyai:

- favicon/logo
- nama website
- deskripsi singkat
- kategori
- subkategori
- tipe
- domain
- tombol Open

Jika link adalah GitHub:

```text
GitHub icon

react-three-fiber

React renderer for Three.js

Development
3D / Library

github.com/pmndrs/react-three-fiber
```

---

# Website Preview

Ini fitur penting.

Ketika card diklik, buka halaman detail seperti:

```text
/tools/shader-gradient
```

Halaman detail menampilkan:

```text
Shader Gradient

Design → Gradient

https://shadergradient.co/

[Open Website]
```

Kemudian tampilkan **preview visual website**.

Preview sebaiknya berupa screenshot halaman website tersebut.

Jangan bergantung sepenuhnya pada iframe karena banyak website memblokir iframe menggunakan:

```text
X-Frame-Options
Content-Security-Policy
```

Gunakan screenshot/thumbnail website sebagai preview utama.

Jika iframe dapat digunakan, boleh menyediakan:

```text
Live Preview
```

sebagai fitur tambahan.

---

# Detail Tool

Setiap halaman detail cukup mempunyai:

```text
Logo

Nama

Deskripsi

Category

Subcategory

Type

URL

Preview

Open Website
```

Tambahkan opsional:

```text
Notes
Tags
```

Contoh:

```text
Name:
Aceternity UI

Description:
Collection of animated React UI components.

Category:
Design

Subcategory:
UI Components

Type:
Website / Component Library

Tags:
React
Animation
UI

URL:
https://ui.aceternity.com/
```

---

# Search

Search harus dapat mencari berdasarkan:

- nama
- deskripsi
- kategori
- subkategori
- tag
- domain

Contoh pencarian:

```text
animation
```

menghasilkan:

```text
Animations.dev
AnimMaster
Aceternity UI
Design Spells
```

Pencarian:

```text
database
```

menghasilkan:

```text
Baserow
```

---

# Filter

Tambahkan filter sederhana.

```text
Category

All
Design
Development
AI
Productivity
Business
Utilities
```

dan:

```text
Type

All
Website
GitHub
Documentation
Tool
SaaS
Library
Resource
```

Tidak perlu advanced filter kompleks.

---

# Add Tool

Sediakan tombol:

```text
+ Add Tool
```

Form hanya membutuhkan:

```text
URL
Name
Description
Category
Subcategory
Type
Tags
```

Jika memungkinkan, setelah URL dimasukkan sistem otomatis mengambil:

- favicon
- page title
- meta description
- domain

Contoh:

User memasukkan:

```text
https://railway.com/
```

Sistem mencoba mengambil metadata lalu mengisi:

```text
Name:
Railway

Domain:
railway.com

Favicon:
automatic

Description:
automatic
```

User tetap dapat mengedit semuanya.

---

# Edit dan Delete

Setiap tool harus dapat:

```text
Edit
Delete
```

Tidak perlu workflow moderation.

Website ini untuk penggunaan pribadi.

---

# Favorite

Tambahkan tombol:

```text
Favorite
```

Tool favorit dapat ditampilkan pada bagian:

```text
Favorites
```

---

# Tags

Gunakan sistem tag sederhana.

Contoh:

```text
React
Next.js
CSS
Animation
UI
AI
GitHub
Open Source
Self Hosted
Database
Deployment
```

Satu tool dapat memiliki banyak tag.

---

# Data Model

Gunakan struktur sederhana.

```ts
Tool {
  id
  name
  slug
  url
  description
  favicon
  screenshot

  category
  subcategory
  type

  tags

  favorite

  createdAt
  updatedAt
}
```

Tidak perlu database schema berlebihan.

---

# UI

Gunakan desain:

- minimal
- clean
- modern
- dark mode
- light mode
- responsive
- cepat
- tidak terlalu banyak animasi

Layout desktop menggunakan grid.

Contoh:

```text
-------------------------------------------------

My Tools

[ Search tools...                         ]

All  Design  Development  AI  GitHub

-------------------------------------------------

Design

[Shader Gradient] [21st.dev] [Aceternity UI]

[Godly]           [Dribbble] [Animations.dev]

-------------------------------------------------

Development

[Railway]         [PostHog]  [Sentry]

[Baserow]         [R3F]      [Better-T-Stack]

-------------------------------------------------
```

---

# Sidebar

Untuk desktop dapat menggunakan sidebar:

```text
My Tools

Search

Favorites

Categories

Design
Development
AI
Productivity
Business
Utilities

Types

Websites
GitHub
Documentation
Libraries
SaaS

+ Add Tool
```

Pada mobile sidebar berubah menjadi drawer.

---

# Tech Stack

Gunakan:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Lucide Icons
```

Untuk penyimpanan awal gunakan solusi sederhana.

Pilihan:

```text
SQLite + Prisma
```

atau:

```text
Supabase
```

Jangan membuat arsitektur enterprise.

Prioritaskan kesederhanaan.

---

# Data Awal

Masukkan link berikut sebagai initial seed data dan kelompokkan berdasarkan fungsi yang paling relevan:

```text
https://github.com/garrytan/gstack

https://www.tasteskill.dev/docs

https://github.com/Leonxlnx/taste-skill

https://github.com/pmndrs/react-three-fiber

https://shadergradient.co/

https://www.typeui.sh/design-skills

https://animmasterlib.dev/

https://grok.com/imagine

https://hermes-agent.nousresearch.com/docs/skills/

https://railway.com/

https://www.twilio.com/en-us

https://posthog.com/

https://sentry.io/welcome/

https://paper.design/docs/mcp#overview

https://animations.dev/

https://emilkowal.ski/skill

https://baserow.io/

https://nextcloud.com/

https://dribbble.com/

https://godly.design/

https://skiper-ui.com/v1/skiper77

https://bklit.com/docs/components/gauge-chart

https://ui.shadcn.com/

https://getdesign.md/

https://styles.refero.design/

https://penpot.app/

https://sticky.ui8.dev/

https://goodui.org/

https://designspells.com/spells/camera-opens-from-the-dynamic-island-in-pico-cam

https://21st.dev/

https://ui.aceternity.com/components/evervault-card

https://www.better-t-stack.dev/new

https://www.useplunk.com/

https://www.skills.sh/

https://namethatui.com/

https://excalidraw.com/

https://draw.io/

https://app.cal.com/event-types

https://openseo.so/pricing

https://openworklabs.com/docs/start-here/get-started

https://vibeui.online/
```

Analisis fungsi masing-masing link sebelum menentukan kategori.

Jangan hanya mengategorikan berdasarkan nama domain.

---

# Prinsip Utama

Jangan membuat website menjadi terlalu kompleks.

Tidak diperlukan:

```text
User reviews
Rating
Comparison
Marketplace
Payment
Subscription
Community
Comments
Analytics dashboard
Admin panel kompleks
Multi-user organization
```

Fokus hanya pada:

```text
Save
Categorize
Search
Filter
Preview
Open
Favorite
Add
Edit
Delete
```

Tujuan akhirnya adalah membuat **visual personal library untuk semua website dan tools yang berguna**, sehingga saya dapat menemukan kembali resource berdasarkan fungsi tanpa harus mengingat nama website tersebut.