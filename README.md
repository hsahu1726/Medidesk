# MediDesk

MediDesk is a multimodal Generative AI application that helps users read
medicine packaging and organize handwritten prescriptions from uploaded
images.

The application uses NVIDIA's `nvidia/nemotron-nano-12b-v2-vl`
vision-language model to interpret images and return structured information.
It is intended for educational assistance only and is not a medical
diagnosis, prescription, or replacement for a doctor or pharmacist.

## Features

### MediSnap

Upload a clear photograph of a medicine strip, box, or bottle label to view:

- Medicine name
- General use
- General dosage and timing guidance
- Alcohol precautions
- Possible alternatives
- Common side effects
- Safety warnings

### Prescription Reader

Upload a photograph of a prescription to extract:

- Patient name, when readable
- Medicine names
- Dose
- Frequency
- Timing
- Duration
- Additional notes

Unreadable fields are marked as `Unclear` rather than guessed.

### Additional Features

- Responsive light and dark interface
- Google Calendar medicine reminder template
- Image validation for JPEG, PNG, and WebP
- Maximum upload size of 5 MB
- Evidence and confidence checks before showing AI results
- Request throttling for API protection
- Strict model-response validation with Zod
- Vercel Analytics integration

## How It Works

```text
Image upload
    |
    v
Next.js API route
    |
    +-- Validate type, signature, and file size
    +-- Apply request rate limit
    |
    v
NVIDIA vision-language model
    |
    +-- Verify visible image evidence
    +-- Return structured JSON
    |
    v
Zod schema and confidence validation
    |
    v
Display verified result or reject uncertain input
```

The application rejects unrelated, unreadable, or low-confidence images
instead of intentionally presenting an uncertain identification.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Zod
- NVIDIA Integrate API
- NVIDIA Nemotron vision-language model
- Vercel Analytics

## Project Structure

```text
app/
  api/
    medisnap/             Medicine image analysis endpoint
    prescription-reader/  Prescription extraction endpoint
  layout.tsx              Root layout and metadata
  page.tsx                Main application interface

components/               Page and reusable UI components
hooks/                    Client-side utility hooks
lib/
  api-security.ts         Upload validation and request throttling
  medical-ai.ts           AI response schemas
public/                   Static images and icons
```

## Requirements

- Node.js 20 or newer
- npm
- NVIDIA API key with access to
  `nvidia/nemotron-nano-12b-v2-vl`

Create an API key through the
[NVIDIA API Catalog](https://build.nvidia.com/).

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/hsahu1726/Medidesk.git
   cd Medidesk
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create `.env.local` in the project root:

   ```env
   NVIDIA_API_KEY=your_nvidia_api_key
   ```

   You can start from the included example:

   ```bash
   cp .env.example .env.local
   ```

   On PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

Do not commit `.env.local`. It is excluded by `.gitignore`.

## Available Commands

```bash
npm run dev        # Start the development server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript validation
npm run build      # Create a production build
npm run start      # Start the production server
npm audit          # Check dependency vulnerabilities
```

Before deploying a change, run:

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```

## Deploying To Vercel

1. Push the repository to GitHub.
2. Open the [Vercel dashboard](https://vercel.com/new).
3. Import `hsahu1726/Medidesk`.
4. Keep the detected framework as Next.js.
5. Add the following environment variable:

   ```text
   NVIDIA_API_KEY = your_nvidia_api_key
   ```

6. Enable it for Production and Preview deployments as needed.
7. Deploy the project.

The local `.env.local` file is not uploaded to Vercel. The environment
variable must be configured separately in the Vercel project settings.

## API Endpoints

### `POST /api/medisnap`

Accepts a multipart form upload under the `file` field.

Successful responses contain structured general medicine information.
Unrelated or low-confidence images return HTTP `422`.

### `POST /api/prescription-reader`

Accepts a multipart form upload under the `file` field.

Successful responses contain a structured prescription schedule. Unrelated
or unreadable images return HTTP `422`.

### Upload Rules

- Accepted formats: JPEG, PNG, and WebP
- Maximum size: 5 MB
- File content must match the declared image type
- Requests are limited per route and client
- Upstream AI requests time out after 45 seconds

## Safety And Limitations

MediDesk uses a generative AI model. Even with input checks, confidence
thresholds, and structured validation, AI output can still be incomplete or
incorrect.

- Do not use MediDesk to identify an unknown pill for consumption.
- Do not change a medicine, brand, dose, timing, or treatment based on its
  output.
- Verify medicine details with the original packaging and a pharmacist.
- Verify every prescription field with the prescribing doctor or pharmacist.
- Seek professional medical help for symptoms, side effects, overdoses,
  allergic reactions, or emergencies.

MediDesk does not store uploaded images in an application database, but
images are transmitted to NVIDIA's API for processing. Review the applicable
privacy and data-processing terms before using real medical documents.

## Current Status

MediDesk is suitable as a GenAI demonstration and educational prototype. It
is not a clinically validated medical device.

## License

No open-source license has been added yet. Unless a license is provided, the
repository remains under default copyright protection.
