# ליווי ההריון שלי

Build a mobile-first Web Application designed for expecting couples during childbirth and postpartum. The app must be structured cleanly so it can easily be converted into a native mobile app in the future.

### Core Language & RTL Requirements (CRITICAL)

1. The entire user interface must be in Hebrew.

2. Set the root layout to `dir="rtl"` and `lang="he"`.

3. All UI components, text alignments, flex directions, and icons must follow Right-to-Left (RTL) rules.

4. Import and use the Google Font 'Rubik' or 'Assistant' as the primary font family for a modern, warm, and readable Hebrew design.

5. Ensure punctuation marks appear correctly at the left end of Hebrew sentences.

### Design & Aesthetic

- Color Palette: Soft, soothing colors matching a modern birthing guide — gentle pastel pinks, soft sage greens, warm off-whites, and neutral dark gray for text.

- UI/UX: Ultra-clean, premium mobile-app look with smooth rounded corners, soft shadows, and generous spacing. Responsive on all mobile screens.

### Feature 1: Password Gate (Simple MVP Auth)

- The app must start on a simple, elegant Access Screen.

- Include a headline: "ברוכים הבאים לליווי הדיגיטלי ללידה" and a input field asking for a "קוד גישה".

- Logical check: If the user enters the code "Celia2026", store a session (localStorage) and grant access to the main dashboard.

- If incorrect, show a friendly error message: "קוד גישה שגוי, אנא בדקו את הקוד שקיבלתם בקורס".

### Feature 2: Main Dashboard & 7-Stage Timeline Navigation

Once logged in, show the main application dashboard containing:

1. Header with the app title and a small logout/reset button.

2. An interactive horizontal timeline (or top navigation bar) displaying 7 stages:

   - 1. טרום הלידה

   - 2. השלב הלטנטי

   - 3. המעבר לבית החולים

   - 4. השלב הפעיל

   - 5. לידת השליה

   - 6. הרגע שאחרי

   - 7. משכב לידה

3. Selecting a stage dynamically changes the content section below it.

4. For this first version, create clean content card placeholders for each stage with a title, a short introductory text, and icon indicators.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gil-dror-midwife-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/656cc0f1-d550-4de1-bd4e-b0eaf64e28f7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
