import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import noBgLogo from "../../assets/whiteBgLogo.png";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../services/operations/auth.service";
import { setResetEmail } from "../../slices/password.slice";

function ForgetPassword() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const submitHandler = async (data) => {
      try {
         const response = await dispatch(forgotPassword(data.email));
         if (response) {
            // dispatch(setResetEmail(data.email));
            console.log(response)
            localStorage.setItem("resetEmail", data.email)
            // toast.success("OTP sent successfully");
            navigate("/verify-otp");
         } else {
            toast.error(
               (response && response.message) || "Failed to send OTP"
            );
         }
      } catch (error) {
         toast.error("Error in sending OTP");
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br text-black from-teal-100 to-teal-300 flex flex-col items-center justify-center p-6">
         <div className="flex justify-center mb-6">
            <img
               src={noBgLogo}
               className="h-16 rounded-md object-contain"
               alt="Logo"
            />
         </div>
         <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-teal-500/50 p-8">
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
               Forgot Password
            </h2>
            <form
               onSubmit={handleSubmit(submitHandler)}
               className="space-y-5"
            >
               <div>
                  <label className="block text-base font-medium text-teal-500 mb-1">
                     Email
                  </label>
                  <input
                     type="email"
                     className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
                     placeholder="Enter your email"
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                           message: "Invalid email address",
                        },
                     })}
                  />
                  {errors.email && (
                     <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                     </p>
                  )}
               </div>
               <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
               >
                  Send OTP
               </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
               Remember your password?{" "}
               <a
                  href="/login"
                  className="text-teal-600 hover:underline"
               >
                  Log in
               </a>
            </p>
         </div>
      </div>
   );
}

export default ForgetPassword;
