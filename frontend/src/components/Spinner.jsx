export default function Spinner({ size = "" }) {
  return <div className={`spinner ${size === "lg" ? "spinner-lg" : ""}`} role="status" aria-label="Loading" />;
}
