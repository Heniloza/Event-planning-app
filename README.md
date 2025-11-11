# Festora – Event Planning Mobile App

Festora is a mobile application built for organizing and booking event-services like venues, catering and decoration. Users, vendors and admins each have dedicated roles — enabling vendors to list service packages and users to book them securely. The app features OTP-based authentication, role-based access control and smooth mobile usability.

---

## Features

- Role-Based Access Control (RBAC): three roles — **User**, **Vendor** and **Admin**  
- Vendors: Create, update and manage service packages (venue, catering, decoration etc)  
- Users: Browse packages, filter by category, book services and connect with vendors  
- Admin: Oversee all users, vendors, reports and vendor register request 
- Secure OTP-based authentication for login/registration  
- Mobile-first interface built with React Native (Expo) for smooth experiences  

---

## Tech Stack

**Frontend:**  
- React Native (via Expo)  
- TypeScript (optional, if used)  
- UI toolkit (e.g., NativeBase / React Native Paper / Tailwind CSS for React Native)  
- Role-aware navigation and screen flows  

**Backend:**  
- Node.js + Express.js  
- MongoDB (via Mongoose)  
- JWT + OTP for authentication  
- RESTful APIs for users, vendors, packages, bookings  
