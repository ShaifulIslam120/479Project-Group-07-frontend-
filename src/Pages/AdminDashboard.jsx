import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    setLoading(false);
  }, []);

  // Redirect if not admin & fetch users
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        navigate('/signin');
      } else {
        fetchPendingUsers();
        fetchApprovedUsers();
      }
    }
  }, [loading, user, navigate]);

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('http://localhost:4000/users/pending');
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch pending users',
        text: err.message,
      });
    }
  };

  // Fetch approved users
  const fetchApprovedUsers = async () => {
    try {
      const res = await fetch('http://localhost:4000/users/approved');
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setApprovedUsers(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch approved users',
        text: err.message,
      });
    }
  };

  // Approve or reject a user
  const handleApproval = async (id, approve = true) => {
    try {
      await fetch(`http://localhost:4000/users/${id}/status`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: approve ? 'approved' : 'rejected' })
      });

      Swal.fire({
        icon: 'success',
        title: approve ? 'User Approved' : 'User Rejected',
        timer: 1500,
        showConfirmButton: false
      });

      // Update lists locally without re-fetching
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      if (approve) {
        const approvedUser = pendingUsers.find(u => u._id === id);
        if (approvedUser) setApprovedUsers(prev => [...prev, approvedUser]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update status',
        text: err.message,
      });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative md:w-[80%] md:ml-[20%] w-full h-screen overflow-auto p-8 bg-gray-100 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Pending Users */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pending Users</h2>
        {pendingUsers.length === 0 ? (
          <p className="text-gray-600">No users pending approval.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white rounded-lg shadow border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u._id} className="text-center border-t hover:bg-gray-50">
                    <td className="px-4 py-2 border">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border capitalize">{u.role}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleApproval(u._id, true)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(u._id, false)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Approved Users */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Approved Users</h2>
        {approvedUsers.length === 0 ? (
          <p className="text-gray-600">No approved users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white rounded-lg shadow border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map(u => (
                  <tr key={u._id} className="text-center border-t hover:bg-gray-50">
                    <td className="px-4 py-2 border">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
