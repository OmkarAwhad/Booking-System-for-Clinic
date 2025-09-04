import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import noBgLogo from "../../assets/whiteBgLogo.png";
import { useDispatch } from "react-redux";
import { changePassword } from "../../services/operations/auth.service";

function ChangePassword() {
   const {
      register,
      handleSubmit,
      getValues,
      formState: { errors },
   } = useForm();

   const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useDispatch();
   const resetToken = localStorage.getItem("resetToken") // Get token from previous step

   const submitHandler = async (data) => {
      try {
         const response = await dispatch(
            changePassword(resetToken, data.newPassword, data.confirmPassword)
         );
         if (response && response.success) {
            toast.success(response.message || "Password changed successfully");
            localStorage.removeItem("resetToken")
            navigate("/login"); // Redirect to login after success
         } else {
            toast.error((response && response.message) || "Failed to change password");
         }
      } catch (error) {
         toast.error("Error in changing password");
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
               Change Password
            </h2>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
               <div>
                  <label className="block text-base font-medium text-teal-500 mb-1">
                     New Password
                  </label>
                  <input
                     type="password"
                     className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
                     placeholder="Enter new password"
                     {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                           value: 8,
                           message: "Password must be at least 8 characters",
                        },
                     })}
                  />
                  {errors.newPassword && (
                     <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword.message}
                     </p>
                  )}
               </div>
               <div>
                  <label className="block text-base font-medium text-teal-500 mb-1">
                     Confirm Password
                  </label>
                  <input
                     type="password"
                     className="w-full px-4 py-2 border border-main-teal rounded-lg outline-none transition-colors"
                     placeholder="Confirm new password"
                     {...register("confirmPassword", {
                        required: "Confirm password is required",
                        minLength: {
                           value: 8,
                           message: "Password must be at least 8 characters",
                        },
                        validate: (value) =>
                           value === getValues("newPassword") || "Passwords do not match",
                     })}
                  />
                  {errors.confirmPassword && (
                     <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                     </p>
                  )}
               </div>
               <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
               >
                  Change Password
               </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
               Back to{" "}
               <a href="/login" className="text-teal-600 hover:underline">
                  Log in
               </a>
            </p>
         </div>
      </div>
   );
}

export default ChangePassword;
