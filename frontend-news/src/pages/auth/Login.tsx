import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

interface LoginFormValues {
   email: string;
   password: string;
}

const Login: React.FC = () => {
   const { login } = useAuth();   

   const navigate = useNavigate();
   const initialValues: LoginFormValues = {
      email: '',
      password: '',
   };

   const validationSchema = Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
   });


   const onSubmit = async (values: { email: string; password: string }) => {
      try {
         const data = await loginUser({ email: values.email, password: values.password });
         login(data?.access_token, { id: data.user.id, name: data.user.name, email: data.user.email }); 
         navigate('/news-page');  
      } catch (error) {
         console.error("Login failed:", error instanceof Error ? error.message : error);
      }
   };

   return (
      <div className="flex items-center justify-center h-[70vh]">
         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            <Form className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
               <h2 className="mb-4 text-2xl font-bold">Login</h2>

               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                     Email
                  </label>
                  <Field
                     type="email"
                     name="email"
                     id="email"
                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
               </div>

               <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                     Password
                  </label>
                  <Field
                     type="password"
                     name="password"
                     id="password"
                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
               </div>

               <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
               >
                  Login
               </button>

               <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                     Not registered?{' '}
                     <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign Up</Link>
                  </p>
               </div>
            </Form>
         </Formik>
      </div>
   );
};

export default Login;
