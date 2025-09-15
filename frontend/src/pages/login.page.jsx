import LoginForm from "../components/loginForm.component";
import buildingIcon from "../assets/building.icon.png";
function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center mt-20 bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-blue-200 p-3">
            <img src={buildingIcon} alt="Building" className="h-8 w-8"></img>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
