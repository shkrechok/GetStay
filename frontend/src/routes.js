import { HomePage } from './pages/home-page.jsx'
import { AboutUs } from './pages/about-us.jsx'
import { StayIndex } from './pages/stay-index.jsx'
import { ReviewIndex } from './pages/review-index.jsx'
import { ChatApp } from './pages/chat-app.jsx'
import { AdminApp } from './pages/admin-app.jsx'
import { StayDetails } from './pages/stay-details.jsx'
import { Order } from './pages/order.jsx'
import { Login } from './pages/login-page.jsx'
import { Signup } from './pages/signup-page.jsx'
import { UserDetails } from './pages/user-details.jsx'
import { Wishlist } from './pages/wishlist.jsx'
import { UserTrips } from './pages/user-trips.jsx'
import { UserRentals } from './pages/user-rentals.jsx'
import { Dashboard } from './pages/dashboard.jsx'

// Routes accesible from the main navigation (in AppHeader)
const routes = [
    {
        path: '/',
        component: <HomePage />,
        label: 'Home 🏠',
    },
    {
        path: 'stay',
        component: <StayIndex />,
        label: 'Stays'
    },
    {
        path: 'stay/:stayId',
        component: <StayDetails />,
        label: 'Stay Details'
    },
    {
        path: 'order',
        component: <Order />,
        label: 'Order'
    },
    {
        path: 'review',
        component: <ReviewIndex />,
        label: 'Reviews'
    },
    {
        path: 'chat',
        component: <ChatApp />,
        label: 'Chat'
    },
    {
        path: 'about',
        component: <AboutUs />,
        label: 'About us'
    },
    {
        path: 'admin',
        component: <AdminApp />,
        label: 'Admin Only'
    },
    {
        path: 'login',
        component: <Login />,
        label: 'Login'
    },
    {
        path: 'signup',
        component: <Signup />,
        label: 'Sign Up'
    },
    {
        path: 'user/:userId',
        component: <UserDetails />,
        label: 'User Details'
    },
    {
        path: 'user/:userId/wishlist',
        component: <Wishlist />,
        label: 'My Wishlist'
    },
    {
        path: 'user/:userId/trips',
        component: <UserTrips />,
        label: 'My Trips'
    },
    // {
    //     path: 'user/:userId/dashboard/rentals',
    //     component: <UserRentals />,
    //     label: 'My Rentals'
    // },
    {
        path: 'user/:userId/dashboard',
        component: <Dashboard />,
        label: 'Dashboard'
    }

]

export default routes