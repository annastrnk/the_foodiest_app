# The Foodiest App 🍔

A modern Next.js application for sharing and discovering delicious meals. Users can browse a collection of meals, view detailed recipes, and share their own favorite dishes with the community.

## Features

- 🍽️ **Browse Meals** - View a collection of delicious meals with images and summaries
- 📝 **Meal Details** - See full recipe instructions and creator information
- ➕ **Share Meals** - Add your own meals with images, instructions, and details
- 🖼️ **Image Upload** - Upload meal images stored securely in AWS S3
- 🔍 **Search & Navigation** - Easy navigation through meal collections

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router with Turbopack)
- **React**: 19.2.0
- **Database**: MongoDB (MongoDB Atlas)
- **Storage**: AWS S3 (for meal images)
- **Styling**: CSS Modules
- **Other**: 
  - `slugify` - URL-friendly slugs
  - `xss` - XSS protection for user input
  - `dotenv` - Environment variable management

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB instance)
- AWS account with S3 bucket configured

## Installation

1. **Clone the repository** (or navigate to the project directory)

```bash
cd the_foodiest_app
```

2. *Install dependencies**

```bash
npm install
```

3. **Development Mode**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

