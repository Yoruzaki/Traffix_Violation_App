import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCar, FaLock } from 'react-icons/fa';
import Logo from '../../assets/logo.png';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    cin: '',
    license_plate: '',
    vehicle_type: '',
    password: '',
    confirm_password: '',
  };

  const vehicleTypes = ['Voiture', 'Camion', 'Moto', 'Bus', 'Autre'];

  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{9}$/, 'Phone number must be 9 digits')
      .required('Phone number is required'),
    cin: Yup.string().required('CIN is required'),
    license_plate: Yup.string().required('License plate is required'),
    vehicle_type: Yup.string().required('Vehicle type is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { confirm_password, ...userData } = values;
    const result = await register(userData);
    
    if (!result.success) {
      setErrors({ email: result.message });
    }
    setSubmitting(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-white/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-8">
          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              <div className="relative p-1 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                <div className="bg-gray-900 p-3 rounded-full flex items-center justify-center">
                  <img 
                    src={Logo} 
                    alt="Traffix Logo" 
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>
              <motion.div 
                className="absolute inset-0 border-2 border-transparent rounded-full pointer-events-none"
                animate={{
                  borderColor: ['rgba(255,255,255,0.1)', 'rgba(96, 165, 250, 0.3)', 'rgba(255,255,255,0.1)'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  scale: 1.1
                }}
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-center text-white mb-2"
            variants={itemVariants}
          >
            Create Account
          </motion.h1>
          
          <motion.p 
            className="text-center text-white/70 mb-8"
            variants={itemVariants}
          >
            Register as a civil user
          </motion.p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-4">
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-white/80 mb-2 text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                    />
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-white/80 mb-2 text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* Phone Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="phone" className="block text-white/80 mb-2 text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-white/5 text-white/50 border-white/10">
                      +213
                    </span>
                    <div className="relative flex-1">
                      <Field
                        type="text"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                      />
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                    </div>
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* CIN Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="cin" className="block text-white/80 mb-2 text-sm font-medium">
                    CIN (National ID)
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      id="cin"
                      name="cin"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                    />
                    <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  </div>
                  <ErrorMessage name="cin" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* License Plate Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="license_plate" className="block text-white/80 mb-2 text-sm font-medium">
                    License Plate
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-white/5 text-white/50 border-white/10">
                      DZ-
                    </span>
                    <div className="relative flex-1">
                      <Field
                        type="text"
                        id="license_plate"
                        name="license_plate"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 transition duration-300"
                      />
                    </div>
                  </div>
                  <ErrorMessage name="license_plate" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* Vehicle Type Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="vehicle_type" className="block text-white/80 mb-2 text-sm font-medium">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <Field
                      as="select"
                      id="vehicle_type"
                      name="vehicle_type"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 appearance-none transition duration-300"
                    >
                      <option value="" className="bg-gray-800">Select vehicle type</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type} className="bg-gray-800">{type}</option>
                      ))}
                    </Field>
                    <FaCar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage name="vehicle_type" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block text-white/80 mb-2 text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                    />
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="confirm_password" className="block text-white/80 mb-2 text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                    />
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  </div>
                  <ErrorMessage name="confirm_password" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-500 overflow-hidden relative ${
                      isSubmitting 
                        ? 'bg-blue-600/70' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center text-white">
                      {isSubmitting ? 'Registering...' : 'REGISTER'}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </motion.div>

                {/* Login Link */}
                <motion.div 
                  className="mt-4 text-center"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    className="text-white/70 hover:text-white text-sm transition duration-300"
                    onClick={() => navigate('/login')}
                  >
                    Already have an account? <span className="font-medium">Login</span>
                  </button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>

      {/* Add these styles to your global CSS */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;