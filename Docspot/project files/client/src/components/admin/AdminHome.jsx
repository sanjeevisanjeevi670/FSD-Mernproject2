import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import Notification from '../common/Notification';
import AdminUsers from './AdminUsers';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';

const AdminHome = () => {
  const [userdata, setUserData] = useState({})
  const [activeMenuItem, setActiveMenuItem] = useState('');

  const getUserData = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/user/getuserdata',
        {},
        { headers: { Authorization: "Bearer " + localStorage.getItem('token') } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    if (user) setUserData(user)
  }

  useEffect(() => {
    getUserData();
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    window.location.href = "/"
  }

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <>
      <div className='main'>
        <div className="layout">
          <div className="sidebar">

            <div className="logo">
              <h2>Medicohub</h2>
            </div>

            <div className="menu">

              <div
                className={`menu-items ${activeMenuItem === 'adminusers' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('adminusers')}
              >
                <i className="bi bi-people-fill icon"></i>
                <Link>Users</Link>
              </div>

              <div
                className={`menu-items ${activeMenuItem === 'admindoctors' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('admindoctors')}
              >
                <i className="bi bi-person-badge-fill icon"></i>
                <Link>Doctor</Link>
              </div>

              <div className="menu-items">
                <i className="bi bi-box-arrow-right icon"></i>
                <Link onClick={logout}>Logout</Link>
              </div>

            </div>
          </div>

          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: 'pointer' }}>

                <Badge
                  className={`notify ${activeMenuItem === 'notification' ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick('notification')}
                  count={userdata?.notification ? userdata.notification.length : 0}
                >
                  <i className="bi bi-bell-fill icon"></i>
                </Badge>

                <h3 >welcome {userdata.fullName}!</h3>
              </div>
            </div>

            <div className="body">
              {activeMenuItem === 'notification' && <Notification />}
              {activeMenuItem === 'adminusers' && <AdminUsers />}
              {activeMenuItem === 'admindoctors' && <AdminDoctors />}
              {activeMenuItem !== 'notification' &&
                activeMenuItem !== 'adminusers' &&
                activeMenuItem !== 'admindoctors' &&
                <AdminAppointments />}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
