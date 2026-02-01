import { FaRegSadTear } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <FaRegSadTear className="text_color text-9xl mb-6" />
      <h1 className="text-6xl font-bold mb-4 text_color">404</h1>
      <p className="text-xl text_color mb-8">
        Oops! La página que buscas no fue encontrada.
      </p>
    </div>
  );
}
