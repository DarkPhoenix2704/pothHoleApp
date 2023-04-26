import React, { useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { User, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { auth } = useFirebase();
  const navigate = useNavigate();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((user) => {
      console.log(user);
      if (user) {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User) => {
      if (user) {
        navigate("/");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="flex flex-col" onSubmit={login}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="border rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
