import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const UserAppointments = () => {
  const [userid, setUserId] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  // Get user info from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserId(user._id);
      setIsDoctor(user.isdoctor);
    } else {
      alert('No user logged in');
    }
  }, []);

  // Fetch appointments only when userid is ready
  useEffect(() => {
    if (!userid) return;

    if (isDoctor) {
      getDoctorAppointments();
    } else {
      getUserAppointments();
    }
  }, [userid, isDoctor]);

  const getUserAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/getuserappointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { userId: userid },
      });
      if (res.data.success) {
        setUserAppointments(res.data.data || []);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch user appointments');
    }
  };

  const getDoctorAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/getdoctorappointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { userId: userid },
      });
      if (res.data.success) {
        setDoctorAppointments(res.data.data || []);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch doctor appointments');
    }
  };

  const handleStatus = async (userId, appointmentId, status) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/handlestatus',
        { userId, appointmentId, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctorAppointments();
        getUserAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to update status');
    }
  };

  const handleDownload = async (document, appointId) => {
    if (!document) return message.info("No document to download");

    try {
      const res = await axios.get('http://localhost:5000/api/doctor/getdocumentdownload', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { appointId },
        responseType: 'blob'
      });

      const fileUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = document.filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
      message.error('Failed to download document');
    }
  };

  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments</h2>
      <Container>
        {isDoctor ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Appointment</th>
                <th>Phone</th>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.length ? doctorAppointments.map(a => (
                <tr key={a._id}>
                  <td>{a.userInfo.fullName}</td>
                  <td>{a.date}</td>
                  <td>{a.userInfo.phone}</td>
                  <td>
                    {a.document ? (
                      <Button variant='link' onClick={() => handleDownload(a.document, a._id)}>
                        {a.document.filename}
                      </Button>
                    ) : 'No File'}
                  </td>
                  <td>{a.status}</td>
                  <td>
                    {a.status !== 'approved' && (
                      <Button onClick={() => handleStatus(a.userInfo._id, a._id, 'approved')}>
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>
                    <Alert variant="info">No Appointments to show</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Date of Appointment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.length ? userAppointments.map(a => (
                <tr key={a._id}>
                  <td>{a.docName || "Unknown"}</td>
                  <td>{a.date}</td>
                  <td>{a.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3}>
                    <Alert variant="info">No Appointments to show</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;
