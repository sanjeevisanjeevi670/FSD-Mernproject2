import React, { useEffect, useState } from 'react'
import { Badge, Row } from 'antd';
import Notification from '../common/Notification';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FiCalendar, FiLogOut } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";

import ApplyDoctor from './ApplyDoctor';
import UserAppointments from './UserAppointments';
import DoctorList from './DoctorList';

const UserHome = () => {
   const [doctors, setDoctors] = useState([])
   const [userdata, setUserData] = useState({})
   const [activeMenuItem, setActiveMenuItem] = useState('');

   const getUser = () => {
      const user = JSON.parse(localStorage.getItem('userData'))
      if (user) setUserData(user)
   }

   const getUserData = async () => {
      try {
         await axios.post('http://localhost:5000/api/user/getuserdata', {}, {
            headers: {
               Authorization: "Bearer " + localStorage.getItem('token')
            },
         });
      } catch (error) {
         console.log(error);
      }
   };

   const getDoctorData = async () => {
      try {
         const res = await axios.get('http://localhost:5000/api/user/getalldoctorsu', {
            headers: {
               Authorization: "Bearer " + localStorage.getItem('token')
            },
         });
         if (res.data.success) {
            setDoctors(res.data.data)
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getUser();
      getUserData();
      getDoctorData();
   }, []);

   const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/";
   };

   const handleMenuItemClick = (menuItem) => {
      setActiveMenuItem(menuItem);
   };

   return (
      <>
         <div className='main'>
            <div className="layout">
               <div className="sidebar">
                  <div className="logo">
                     <h2>MedicoHub</h2>
                  </div>

                  <div className="menu">
                     <div
                        className={`menu-items ${activeMenuItem === 'userappointments' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('userappointments')}
                     >
                        <FiCalendar className='icon' />
                        <Link>Appointments</Link>
                     </div>

                     {userdata.isdoctor !== true && (
                        <div
                           className={`menu-items ${activeMenuItem === 'applyDoctor' ? 'active' : ''}`}
                           onClick={() => handleMenuItemClick('applyDoctor')}
                        >
                           <FaUserMd className='icon' />
                           <Link>Apply doctor</Link>
                        </div>
                     )}

                     <div className="menu-items" onClick={logout}>
                        <FiLogOut className='icon' />
                        <Link>Logout</Link>
                     </div>
                  </div>
               </div>

               <div className="content">
                  <div className="header">
                     <div className="header-content">
                        <Badge
                           className={`notify ${activeMenuItem === 'notification' ? 'active' : ''}`}
                           onClick={() => handleMenuItemClick('notification')}
                           count={userdata?.notification ? userdata.notification.length : 0}
                        >
                           <IoNotificationsOutline className="icon" />
                        </Badge>

                        {userdata.isdoctor === true && <h3>Dr.</h3>}
                        <h3>{userdata.fullName}</h3>
                     </div>
                  </div>

                  <div className="body">
                     {activeMenuItem === 'applyDoctor' && <ApplyDoctor userId={userdata._id} />}
                     {activeMenuItem === 'notification' && <Notification />}
                     {activeMenuItem === 'userappointments' && <UserAppointments />}

                     {activeMenuItem === '' && (
                        <Container>
                           <h2 className="text-center p-2">Home</h2>

                           {userdata.isdoctor !== true && (
                              <Row>
                                 {doctors?.map((doctor, i) => (
                                    <DoctorList
                                       userDoctorId={doctor.userId}
                                       doctor={doctor}
                                       userdata={userdata}
                                       key={i}
                                    />
                                 ))}
                              </Row>
                           )}
                        </Container>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserHome;
