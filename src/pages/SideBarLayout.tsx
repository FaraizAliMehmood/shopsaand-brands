import React from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, CreditCard, User, Bell, MessageCircle,BadgeCheck, CircleUser } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import logo from '../assets/react.svg'

// Define interfaces for better type safety
interface SidebarLink {
  name: string
  path: string
  icon: React.ReactNode
}

const SideBarLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const sidebarLinks: SidebarLink[] = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={24} /> },
    { name: "Products", path: "/products", icon: <Package size={24} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart size={24} /> },
    { name: "Payments", path: "/payments", icon: <CreditCard size={24} /> },
    { name: "Profile", path: "/profile", icon: <User size={24} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={24} /> },
    { name: "Chat", path: "/chat", icon: <MessageCircle size={24} /> },
    { name: "KYC", path: "/kyc", icon: <BadgeCheck size={24} /> }
  ]

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to="/">
          <img className="cursor-pointer w-7 md:w-7" src={logo} alt="dummyLogoColored" />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! {user?.name || user?.email || 'User'}</p>
          <button 
            onClick={handleLogout}
            className='border rounded-full text-sm px-4 py-1 hover:bg-gray-100 transition-colors'
          >
            Logout
          </button>
        </div>
      </div>

      <div className='flex'>
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink 
              to={item.path} 
              key={item.name} 
              end={item.path === "/dashboard"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                ${isActive 
                  ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                  : "hover:bg-gray-100/90 border-white"
                }`
              }
            >
              {item.icon}
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  )
}

export default SideBarLayout
