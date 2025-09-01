import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import signlottie from '../assets/Login verification.json';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showErrorAlert = (message) => {
    MySwal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3b82f6',
      background: '#1e293b',
      color: '#ffffff'
    });
  };

  const showSuccessAlert = () => {
    MySwal.fire({
      icon: 'success',
      title: 'Welcome Back!',
      text: 'You have logged in successfully.',
      confirmButtonColor: '#10b981',
      background: '#1e293b',
      color: '#ffffff',
      timer: 2000
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorAlert(data.message || 'Login failed');
      } else {
        if (data.user.status !== 'approved') {
          showErrorAlert('Your account is not approved yet. Please wait for admin approval.');
          return;
        }

        showSuccessAlert();
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userUpdated'));

        setTimeout(() => {
          if (data.user.role === 'faculty') navigate('/faculty/dashboard');
          else if (data.user.role === 'student') navigate('/student/dashboard');
          else if (data.user.role === 'admin') navigate('/admin/dashboard');
          else navigate('/home');
        }, 2000);
      }
    } catch (err) {
      showErrorAlert('Something went wrong. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-12 w-full max-w-7xl">
        
        {/* Lottie Animation */}
        <div className="hidden lg:block lg:w-1/2 transform hover:scale-105 transition-transform duration-300">
          <Lottie animationData={signlottie} loop autoplay className="w-full h-auto max-h-[500px]" />
        </div>

        {/* Sign In Card */}
        <div className="card w-full max-w-md shadow-2xl bg-base-100 backdrop-blur-sm bg-opacity-90">
          <div className="card-body p-8">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-center text-gray-500 mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Email</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control mt-6">
                <label className="label"><span className="label-text font-medium">Password</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <label className="label">
                  <Link to="/forgot-password" className="label-text-alt link link-primary">
                    Forgot password?
                  </Link>
                </label>
              </div>

              <div className="form-control mt-8">
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="link link-primary">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
