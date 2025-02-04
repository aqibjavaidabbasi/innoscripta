import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, saveAuthToken } from "../../utils/api";

interface SignUpFormValues {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}


const SignUp: React.FC = () => {
   const navigate = useNavigate();

   const initialValues: SignUpFormValues = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
   };

   const validationSchema = Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().required("Required")
         .oneOf([Yup.ref('password')], 'Passwords do not match'),
   });

   const onSubmit = async (values: SignUpFormValues) => {
      try {
         const userData = await registerUser({
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword,
         });

         saveAuthToken(userData.token);

         navigate('/news');
      } catch (error) {
         console.error('Registration error:', error);
      }
   };

   return (
      <div className="flex items-center justify-center h-[70vh] ">
         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            <Form className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md">
               <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

               <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                     Name
                  </label>
                  <Field
                     type="text"
                     name="name"
                     id="name"
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
               </div>
               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                     Email
                  </label>
                  <Field
                     type="email"
                     name="email"
                     id="email"
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
               </div>

               <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                     Password
                  </label>
                  <Field
                     type="password"
                     name="password"
                     id="password"
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
               </div>

               <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                     Confirm Password
                  </label>
                  <Field
                     type="password"
                     name="confirmPassword"
                     id="confirmPassword"
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
               </div>

               <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
               >
                  Register
               </button>

               <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                     Already have an account?{' '}
                     <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
                  </p>
               </div>
            </Form>
         </Formik>
      </div>
   );
};

export default SignUp;
