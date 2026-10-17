# Clarity Mentor API Integration & Reference Guide

This documentation details the complete Axios-based API client layer implemented for the Clarity Mentor React Native application, based on the **Clarity Mentor Postman Collection**.

---

## 1. Architecture Overview

The API architecture is modular, type-safe, and follows React Native best practices:

```
src/
├── config/
│   └── index.ts               # Base URL and global app configs
├── storage/
│   └── tokenStorage.ts        # Token, role, and user persistence
├── api/
│   ├── axiosInstance.ts       # Centralized Axios client & interceptors
│   ├── authApi.ts             # User and seeker authentication endpoints
│   ├── seekerApi.ts           # Seeker profile, dashboard, sessions, meet
│   ├── mentorApi.ts           # Mentor profile, availability, banking
│   ├── bookingApi.ts          # Bookings, payments, order verification
│   ├── conversationApi.ts     # 1-on-1 chat, messages, sessions
│   ├── reviewApi.ts           # Session reviews and goal outcomes
│   ├── paymentApi.ts          # Invoices, transactions, payouts
│   ├── homeApi.ts             # Public directory, stories, newsletters, blogs
│   ├── adminApi.ts            # Administration and platform operations
│   ├── index.ts               # Unified API export
│   └── README.md              # Complete API documentation
└── services/
    ├── api.ts                 # Backward-compatible Axios bridge
    ├── authService.ts         # High-level auth logic & session persistence
    ├── mentorService.ts       # Mentor data normalization & fallbacks
    └── bookingService.ts      # Booking flow coordination
```

---

## 2. Base URL Configuration

The application API base URL is defined in [`src/config/index.ts`](file:///Users/kurmato/Desktop/clarity/src/config/index.ts):

- **Default base URL**: `https://api.claritymentor.com/v1/api`
- **Request timeout**: 15,000 ms (15 seconds)

To target staging or local development environments, update `API_BASE_URL` in `src/config/index.ts` or wire it with your environment configuration tool (`react-native-config` / `.env`).

---

## 3. Authentication & Token Handling

- **Header Format**: `Authorization: Bearer <access_token>`
- **Automatic Attachment**: The request interceptor in `src/api/axiosInstance.ts` automatically retrieves the active token from `tokenStorage` and attaches it to the `Authorization` header on every outbound request.
- **Session Expiry (HTTP 401)**: The response interceptor flags unauthorized sessions and normalizes the error into a consistent `ApiError` with code `UNAUTHORIZED`.
- **Token Storage**: Managed via `src/storage/tokenStorage.ts` utilizing `@react-native-async-storage/async-storage`.

---

## 4. Error Handling Contract

All network and server errors are intercepted and normalized into a unified `ApiError` interface:

```typescript
export interface ApiError {
  message: string;
  status?: number;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION' | 'SERVER_ERROR' | 'TIMEOUT' | 'NETWORK_ERROR';
  data?: any;
}
```

---

## 5. Multipart / Form-Data Requirements

File uploads (avatars, intro videos, story images, blog covers) are handled using React Native standard file objects:

```typescript
const formData = new FormData();
formData.append('image', {
  uri: file.uri,
  name: file.name || 'image.jpg',
  type: file.type || 'image/jpeg',
} as any);

await api.post('/mentor/profile-image', formData, {
  headers: {'Content-Type': 'multipart/form-data'},
});
```

> **Note**: Do not manually set multipart boundary headers in React Native; the networking bridge automatically computes boundaries with appropriate multipart encoding.

---

## 6. Complete Endpoints Reference

### 6.1 Authentication (`src/api/authApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| User Registration | `POST` | `/user/register` | `{ name, email, password, role: 'seeker' \| 'mentor', utm_source?, ... }` | No |
| User Login | `POST` | `/user/login` | `{ email, password }` | No |
| Verify Register OTP | `POST` | `/user/verify-register-otp` | `{ email, otp, role }` | No |
| Resend Register OTP | `POST` | `/user/resend-register-otp` | `{ email, role }` | No |
| Forgot Password | `POST` | `/user/forgot-password` | `{ email }` | No |
| Set New Password | `POST` | `/user/set-new-password` | `{ email, otp, new_password, confirm_password }` | No |
| Contact Us | `POST` | `/user/contact-us` | `{ name, phone, message }` | No |
| Mentor Profile Slugs | `GET` | `/user/mentor-profile-slugs` | None | No |
| Seeker Login (Legacy) | `POST` | `/seeker/login` | `{ email, password }` | No |
| Seeker Register (Legacy) | `POST` | `/seeker/register` | `{ full_name, email, password }` | No |
| Seeker Verify OTP (Legacy) | `POST` | `/seeker/verify-otp` | `{ email, otp }` | No |
| Seeker Password Reset | `POST` | `/seeker/set-new-password` | `{ otp, email, new_password, confirm_password }` | No |

---

### 6.2 Seeker (`src/api/seekerApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Seeker Me | `GET` | `/seeker/me` | None | Yes |
| Seeker Profile | `GET` | `/seeker/profile` | None | Yes |
| Update Seeker Profile | `POST` | `/seeker/profile/update` | `{ full_name?, bio?, ... }` | Yes |
| Seeker Dashboard | `GET` | `/seeker/dashboard` | None | Yes |
| Upload Profile Image | `POST` | `/seeker/profile-image` | `FormData` (`image: File`) | Yes |
| Get Seeker Sessions | `GET` | `/seeker/sessions` | Params: `{ page, limit, start_date, end_date }` | Yes |
| Mark Session Complete | `POST` | `/seeker/mark-session-complete` | `{ session_id }` | Yes |
| Meeting Link | `GET` | `/meet` | Params: `{ meetid }` | Yes |
| Join Meeting by Token | `GET` | `/meet/join/:token` | Path: `:token` | No / Token |
| Payment History | `GET` | `/payment/seeker/history` | Params: `{ search, page, limit }` | Yes |
| Seeker Invoice | `GET` | `/payment/seeker/invoice/:order_id` | Path: `:order_id` | Yes |

---

### 6.3 Mentor (`src/api/mentorApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Availability Settings | `GET` | `/mentor/availability/settings/:slug` | Path: `:slug` | Optional |
| Update Availability | `POST` | `/mentor/availability/settings` | `{ schedule_type, selected_days, slots }` | Yes |
| Get Public Profile | `GET` | `/mentor/profile/:slug` | Path: `:slug` | Optional |
| Update Mentor Profile | `POST` | `/mentor/profile/update` | `{ full_name, bio, hourly_rate, expertise_area, category_ids, ... }` | Yes |
| Upload Profile Image | `POST` | `/mentor/profile-image` | `FormData` (`image: File`, `full_name?`) | Yes |
| Upload Intro Video | `POST` | `/mentor/intro-video` | `FormData` (`video: File`) | Yes |
| Mentor Me | `GET` | `/mentor/me` | None | Yes |
| Mentor Dashboard | `GET` | `/mentor/dashboard` | None | Yes |
| Mentor Sessions | `GET` | `/mentor/sessions` | Params: `{ page, limit }` | Yes |
| Mentor Invoice | `GET` | `/payment/mentor/invoice/:order_id` | Path: `:order_id` | Yes |
| Add Razorpay Account | `POST` | `/mentor/add-account` | Razorpay account profile object | Yes |
| Add Bank Details | `POST` | `/mentor/add-bank-details` | `{ account_number, ifsc_code, beneficiary_name, pan_number, gst_number }` | Yes |

---

### 6.4 Bookings (`src/api/bookingApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Create Booking | `POST` | `/booking/book` | `{ profile_slug, session_date, time_slot_id, duration_minutes, notes }` | Yes |
| Reschedule Booking | `POST` | `/booking/reschedule` | `{ booking_id, new_date, time_slot_id }` | Yes |
| Cancel Booking | `POST` | `/booking/cancel` | `{ booking_id, reason }` | Yes |
| Create Payment Order | `POST` | `/booking/create-order` | `{ booking_id?, amount, currency? }` | Yes |
| Verify Payment | `POST` | `/booking/verify-payment` | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | Yes |
| Validate Coupon | `GET` | `/booking/coupon-code` | Params: `{ coupon_code }` | Yes |
| Session Feedback | `POST` | `/booking/session-feedback` | `{ session_id, rating, feedback }` | Yes |

---

### 6.5 Conversations & Chat (`src/api/conversationApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Start Conversation | `POST` | `/conversation/start` | `{ profile_slug }` | Yes |
| List Conversations | `GET` | `/conversation/list` | None | Yes |
| Get Messages | `GET` | `/conversation/messages/:id` | Path: `:id`, Params: `{ page, limit }` | Yes |
| Send Message | `POST` | `/conversation/send` | `{ conversation_id, message }` | Yes |
| Conversation Session | `GET` | `/conversation/session/:id` | Path: `:id` | Yes |

---

### 6.6 Reviews (`src/api/reviewApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Add Public Review | `POST` | `/review/add` | `{ session_id, rating, review }` | Yes |
| Submit Goal Outcome | `POST` | `/review/outcome` | `{ session_id, rating (1-5), feedback }` | Yes |

---

### 6.7 Home, Blogs & News (`src/api/homeApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Public Mentors | `GET` | `/home/mentors` | Params: `{ skip, limit, category?, search? }` | No |
| Success Stories | `GET` | `/home/success-stories` | Params: `{ page, limit }` | No |
| Pinned Mentors | `GET` | `/home/pinned-mentors` | None | No |
| Subscribe Newsletter | `POST` | `/news/subscribe` | `{ email }` | No |
| Public Mentor Profile | `GET` | `/mentor/profile/:slug` | Path: `:slug` | No |
| Blog Articles List | `GET` | `/blogs` | Params: `{ skip, limit }` | No |
| Single Blog Article | `GET` | `/blog` | Params: `{ id }` | No |

---

### 6.8 Admin Panel (`src/api/adminApi.ts`)

| Operation | Method | Endpoint | Payload / Parameters | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Admin Login | `POST` | `/admin/login` | `{ email, password }` | No |
| Admin Me | `GET` | `/admin/me` | None | Yes |
| Update Admin Password | `POST` | `/admin/update-password` | `{ current_password, new_password, confirm_password }` | Yes |
| Platform Statistics | `GET` | `/admin/stats` | None | Yes |
| Mentors Listing | `GET` | `/admin/mentor-list` | Params: `{ page, limit, sortBy, sortOrder, search }` | Yes |
| Get Mentor By ID | `GET` | `/admin/mentor/:id` | Path: `:id` | Yes |
| Update Mentor | `PUT` | `/admin/mentor/:id` | Path: `:id`, Body: `Mentor` | Yes |
| Approve / Reject Mentor | `POST` | `/admin/mentor/:id/status` | Path: `:id`, Body: `{ status }` | Yes |
| Mentor Bank Details | `GET` | `/admin/mentor-bank-details` | Params: `{ page, limit }` | Yes |
| Update Bank Status | `PUT` | `/admin/mentor-bank-account/:mentor_id/status` | Path: `:mentor_id`, Body: `{ status }` | Yes |
| Seekers Listing | `GET` | `/admin/seeker-list` | Params: `{ page, limit, sortBy, sortOrder, search }` | Yes |
| Get Seeker By ID | `GET` | `/admin/seeker/:id` | Path: `:id` | Yes |
| Update Seeker Status | `PUT` | `/admin/seeker/:id/status` | Path: `:id`, Body: `{ status }` | Yes |
| Agent Operations | `GET`/`POST`/`PUT`/`DELETE` | `/admin/agent-list`, `/admin/add-agent`, `/admin/update-agent`, `/admin/agent/:id` | Various | Yes |
| Release Payment | `POST` | `/admin/payment/release` | `{ booking_id, mentor_id, amount }` | Yes |
| Categories CRUD | `GET`/`POST`/`PUT`/`DELETE` | `/admin/categories`, `/admin/category`, `/admin/category/:id` | Various | Yes |
| Success Stories CRUD | `GET`/`POST`/`PUT`/`DELETE` | `/admin/success-stories`, `/admin/success-stories/:id` | `FormData` | Yes |
| Email Templates | `GET`/`PUT` | `/admin/email-templates`, `/admin/email-templates/:id` | Various | Yes |
| Contact-Us Requests | `GET`/`PUT`/`DELETE` | `/admin/contact-us`, `/admin/contact-us/:id/status`, `/admin/contact-us/:id` | Various | Yes |
| Quality Score & Content | `GET`/`POST`/`DELETE` | `/admin/mentor-quality-score/:id`, `/admin/mentor-content`, `/admin/mentor-content/:id` | Various | Yes |
| Video Recordings | `GET`/`DELETE` | `/admin/recordings/:room_id`, `/admin/recordings-url/:id`, `/admin/recordings-delete/:id` | Various | Yes |
| All Sessions & Rooms | `GET`/`POST` | `/admin/all-sessions`, `/admin/fetch-room-data`, `/admin/mark-session-complete` | Various | Yes |
| Pin / Unpin Mentors | `POST` | `/admin/pin-mentor`, `/admin/unpin-mentor` | `{ mentor_id }` | Yes |
| Reviews Moderation | `GET`/`PUT` | `/admin/all-reviews`, `/admin/mentor-reviews-status` | Various | Yes |
| Blog CMS | `GET`/`POST`/`PUT`/`DELETE` | `/admin/blogs`, `/admin/blogs/:id`, `/admin/blogs/image/upload`, `/admin/blogs/image/delete` | Various | Yes |

---

## 7. Verification & Testing Instructions

1. **Start the Metro Bundler**:
   ```bash
   npm start
   ```

2. **Launch on Android Emulator / Device**:
   ```bash
   npm run android
   ```

3. **Verify Connected Screens**:
   - **Login Screen**: Enter credentials and test validation and real API submission.
   - **Signup Screen**: Register as Seeker or Mentor and proceed to the OTP Verification screen.
   - **Forgot Password**: Request reset OTP and set new password.
   - **Home Screen**: Observe mentors rendered from API with pull-to-refresh.
   - **Mentor List**: Test category filters and live mentor cards.
   - **Mentor Details**: Inspect live availability slots and book a session.
   - **Booking Screen**: Confirm session booking and check session created in My Sessions.
   - **My Sessions**: Toggle Upcoming / Completed sessions with pull-to-refresh.
   - **Session Details**: Test meeting link retrieval and mark session complete.
   - **Mentor Reviews**: Submit rating and review feedback.
   - **Profile & Edit Profile**: Update name/headline and test secure logout.
   - **Help & Support**: Send inquiry message via `contact-us` API.
