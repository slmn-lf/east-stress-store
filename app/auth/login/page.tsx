"use client";

import LoginForm from "../../components/Form/LoginForm";
import FormInput from "../../components/Form/FormInput";

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>
      <LoginForm>
        <FormInput
          id="username"
          name="username"
          label="Username"
          placeholder="Enter your username"
          required
        />
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </LoginForm>
    </div>
  );
};
export default LoginPage;
