# LinkHive

LinkHive is an innovative forum platform where users can share ideas, connect with like-minded individuals, and participate in discussions on various topics. The application includes features for user authentication, post creation, commenting, voting, and administration. Below is an overview of the project requirements and implemented features.

## Features

### Home Page
- **Navbar**: Includes logo, website name, Home link, Notification icon, and "Join Us" button. If logged in, shows user profile picture with a dropdown menu for Dashboard and Logout.
- **Search**: Search functionality implemented in the backend to filter posts based on tags.
- **Tags Section**: Displays all available tags for posts.
- **Announcements**: Shows announcements with a notification count.
- **Posts Display**: Lists posts with author details, title, tags, votes, and comments count, sorted by newest or popularity.
- **Pagination**: Displays 5 posts per page.

### Post Details Page
- **Post Information**: Displays author details, title, description, tags, time, votes, and comments.
- **Voting**: Users can upvote or downvote with real-time updates.
- **Sharing**: Share posts using the Facebook, Twitter, Telegram and linkedin.
- **Commenting**: Allows logged-in users to add comments.

### Membership Page
- **Payment Gateway**: Users can subscribe to become a member, gaining access to post more than 5 posts and earning a Gold badge.

### User Dashboard
- **My Profile**: Displays user information, badges, and recent posts.
  - Bronze Badge: Awarded upon registration.
  - Gold Badge: Awarded upon membership subscription.
- **Add Post**: Form to create new posts with tags, title, and description. Limited to 5 posts for non-members.
- **My Posts**: Displays user’s posts with options to view comments, delete, and report.

### Admin Dashboard
- **Admin Profile**: Displays admin stats (posts, comments, users) with a pie chart.
- **Manage Users**: Allows admin to search users, make them admins, and view subscription status.
- **Reported Activities**: Handles user reports with options to delete reported content.
- **Announcements**: Admins can create and manage announcements.
- **Tags Management**: Admins can add new tags.

## API Endpoints

### User
1. `POST /jwt`: Get token with email.
2. `POST /user`: Upsert user data (requires token verification).
3. `GET /user`: Retrieve user data (requires token verification).
4. `GET /adminprofile`: Admin profile with site stats (requires token & admin verification).
5. `GET /allusers`: Retrieve all users (requires token & admin verification).
6. `GET /togglerole`: Toggle user roles (requires token & admin verification).

### Posts
7. `GET /tags`: Retrieve all tags.
8. `POST /post`: Publish a new post (requires token verification).
9. `DELETE /post`: Delete a post (requires token verification).
10. `GET /post`: Retrieve all posts.
11. `POST /vote`: Vote on a post (requires token verification).
12. `POST /comment`: Add a comment (requires token verification).
13. `GET /comments`: Retrieve comments.

### Reports
14. `POST /report`: Report an activity (requires token verification).
15. `GET /report`: Retrieve all reports (requires token & admin verification).
16. `DELETE /report`: Delete a report (requires token verification).
17. `DELETE /delete-reported`: Delete reported activity (requires token & admin verification).

### Membership & Announcements
18. `GET /create-payment-intent`: Generate payment intent (requires token verification).
19. `POST /handle-subscribe`: Process subscription payment (requires token verification).
20. `GET /postsbyuser`: Retrieve user-specific posts (requires token verification).
21. `POST /tags`: Admin can add tags (requires token & admin verification).
22. `GET /announce`: Retrieve announcements.
23. `POST /announce`: Post an announcement (requires token & admin verification).
24. `DELETE /announce`: Delete an announcement (requires token & admin verification).

## Technology Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with Axios interceptors, Firebase

## Installation
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables for backend services.
4. Run the development server: `npm run server`.

## Additional Notes
- Local storage is used for storing tokens.
- React-hook-form is implemented for user authentication forms.
- Pagination is implemented for efficient data browsing.
- Server-side searching enhances user and admin functionalities.

Enjoy using **LinkHive**!

