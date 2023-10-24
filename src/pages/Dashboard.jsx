import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const auth = useAuth();

  console.log();
  return (
    <>
      <p>{auth.user.nombre}</p>
      <h1>Estas en Dashboard</h1>
    </>
  );
}

export { Dashboard };
