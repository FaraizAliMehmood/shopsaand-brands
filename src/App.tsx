import { Route, Routes } from 'react-router-dom'
import { AppProviders } from './context'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Kyc from './pages/Kyc'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Notifications from './pages/Notifications'
import PaymentHistory from './pages/PaymentHistory'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import SideBarLayout from './pages/SideBarLayout'

 const App = () => {
  return (
    <AppProviders>
      <div className=' text-default min-h-screen text-gray-700 bg-white'>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={
            <ProtectedRoute>
              <SideBarLayout/>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard/>}/>
            <Route path='/kyc' element={<Kyc/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/products' element={<Product/>}/>
            <Route path='/notifications' element={<Notifications/>}/>
            <Route path='/payments' element={<PaymentHistory/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/chat' element={
              <Chat
                currentUserId="1"
                otherUserId="2"
                otherUserName="test"
                otherUserAvatar="test"
              />
            }/>
          </Route>
        </Routes>
      </div>
    </AppProviders>
  )
}

export default App
