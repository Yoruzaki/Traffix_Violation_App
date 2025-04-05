import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaIdBadge, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from '../../assets/logo.png'; // Updated import path

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const initialValues = {
    identifier: '',
    password: '',
  };

  const validationSchema = Yup.object({
    identifier: Yup.string().required('Identifier is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    const result = await login(values.identifier, values.password);
    if (!result.success) {
      setError(result.message);
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
          {/* Enhanced Logo Container */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              
              {/* Logo container with gradient border */}
              <div className="relative p-1 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                {/* Inner container */}
                <div className="bg-gray-900 p-3 rounded-full flex items-center justify-center">
                  <img 
                    src={Logo} 
                    alt="Traffix Logo" 
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>
              
              {/* Animated rings */}
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
              <motion.div 
                className="absolute inset-0 border-2 border-transparent rounded-full pointer-events-none"
                animate={{
                  borderColor: ['rgba(129, 140, 248, 0.3)', 'rgba(255,255,255,0.1)', 'rgba(129, 140, 248, 0.3)'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
                style={{
                  scale: 1.2
                }}
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-center text-white mb-2"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h1>
          
          <motion.p 
            className="text-center text-white/70 mb-8"
            variants={itemVariants}
          >
            Sign in to your officer account
          </motion.p>
          
          {/* Rest of the form remains the same */}
          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-500/20 border border-red-400/50 text-red-100 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <motion.div 
                  className="mb-5"
                  variants={itemVariants}
                >
                  <label htmlFor="identifier" className="block text-white/80 mb-2 text-sm font-medium">
                    Badge Number or Email
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      id="identifier"
                      name="identifier"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                      placeholder="Enter your badge number or email"
                    />
                    <FaIdBadge className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/50" />
                  </div>
                  <ErrorMessage name="identifier" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>
                
                <motion.div 
                  className="mb-6"
                  variants={itemVariants}
                >
                  <label htmlFor="password" className="block text-white/80 mb-2 text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 text-white placeholder-white/30 pl-12 transition duration-300"
                      placeholder="Enter your password"
                    />
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/50" />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-300 text-sm mt-1" />
                </motion.div>
                
                <motion.div 
                  className="flex justify-between items-center mb-8"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    className="text-white/70 hover:text-white text-sm transition duration-300"
                    onClick={() => navigate('/register')}
                  >
                    Don't have an account? <span className="font-medium">Register</span>
                  </button>
                  <button
                    type="button"
                    className="text-white/70 hover:text-white text-sm transition duration-300"
                    onClick={() => {/* Forgot password functionality */}}
                  >
                    Forgot Password?
                  </button>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-500 overflow-hidden relative group ${
                      isSubmitting 
                        ? 'bg-blue-600/70' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span className="relative z-10 flex items-center justify-center text-white">
                      {isSubmitting ? (
                        'Logging in...'
                      ) : (
                        <>
                          Sign In 
                          <motion.span
                            className="ml-2"
                            animate={{
                              x: isHovered ? 5 : 0
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 15
                            }}
                          >
                            <FaArrowRight />
                          </motion.span>
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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

export default LoginPage;