import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import signlottie from '../assets/lf20_oahmox5r.json';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      title: 'Account Created!',
      text: 'Your account has been successfully created',
      confirmButtonColor: '#10b981',
      background: '#1e293b',
      color: '#ffffff',
      timer: 2000
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showErrorAlert('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorAlert(data.message || 'Signup failed');
      } else {
        showSuccessAlert();
        setTimeout(() => navigate('/signin'), 2000);
      }
    } catch (err) {
      showErrorAlert('Something went wrong. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-[80%] ml-[20%] min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row-reverse items-center justify-center gap-12 max-w-6xl">

        {/* Animation */}
        <div className="hidden lg:block lg:w-1/2 transform hover:scale-105 transition-transform duration-300">
          <Lottie animationData={signlottie} loop autoplay style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* Form Card */}
        <div className="card w-full max-w-md shadow-2xl bg-base-100 backdrop-blur-sm bg-opacity-90">
          <div className="card-body p-8">

            <div className="flex justify-center lg:hidden -mt-20 mb-6">
              <div className="w-40 h-40 bg-base-200 rounded-full p-4 shadow-xl">
                <Lottie animationData={signlottie} loop autoplay />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join LearnSpace
            </h1>
            <p className="text-center text-gray-500 mb-8">Create your account to get started</p>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">First Name</span></label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Last Name</span></label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="input input-bordered w-full" />
                </div>
              </div>

              <div className="form-control mt-6">
                <label className="label"><span className="label-text font-medium">Email</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input input-bordered w-full" />
              </div>

              <div className="form-control mt-6">
                <label className="label"><span className="label-text font-medium">Password</span></label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input input-bordered w-full" />
              </div>

              <div className="form-control mt-6">
                <label className="label"><span className="label-text font-medium">Confirm Password</span></label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="input input-bordered w-full" />
              </div>

              <div className="form-control mt-6">
                <label className="label"><span className="label-text font-medium">Role</span></label>
                <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered w-full">
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <div className="form-control mt-8">
                <button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? <span className="loading loading-spinner"></span> : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm">
                Already have an account?{' '}
                <Link to="/signin" className="link link-primary">Sign In</Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
