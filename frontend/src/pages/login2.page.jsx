import LoginForm from "../components/loginForm.component";

function Login2Page() {
  return (
    <div className="flex min-h-screen flex-col items-center mt-20 bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login2Page;
