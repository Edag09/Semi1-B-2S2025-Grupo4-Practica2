// src/Components/Login/Login.js
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import API_ROUTES from "../Config/apiRoutes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  // Función para decodificar el JWT y extraer su payload
  const decodeToken = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));
      return decoded;
    } catch (err) {
      console.error("❌ Error al decodificar el token:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Campos requeridos",
        detail: "Ingresa tu correo y contraseña",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: email.trim(),
        password: password.trim(),
      };

      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      // ✅ Guardamos token y datos del usuario
      const decoded = decodeToken(data.token);
      const userSession = {
        token: data.token,
        email: data.email,
        username: data.username,
        id_usuario: decoded?.id_usuario || null,
        exp: decoded?.exp || null,
      };

      localStorage.setItem("userSession", JSON.stringify(userSession));

      toast.current.show({
        severity: "success",
        summary: "¡Bienvenido!",
        detail: `Hola ${data.username || email}`,
      });

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error("❌ Error de autenticación:", err);
      toast.current.show({
        severity: "error",
        summary: "Error de inicio de sesión",
        detail: err.message || "No se pudo conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen p-3"
      style={{
        background: "linear-gradient(135deg, #fff8e1 0%, #e8f5e9 40%, #dcedc8 100%)",
      }}
    >
      <Toast ref={toast} />
      <Card
        title={
          <div className="text-center">
            <h1 className="m-0" style={{ color: "#2e7d32" }}>
              Inicia sesión
            </h1>
            <small style={{ color: "#7cb342" }}>
              Tu recetario favorito — comparte y guarda delicias 🥗
            </small>
          </div>
        }
        className="shadow-4"
        style={{
          width: "420px",
          border: "2px solid #c5e1a5",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "18px",
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-column gap-3">
          {/* Correo electrónico */}
          <span className="p-float-label">
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={loading}
              style={{ background: "#F9FFF2", borderColor: "#aed581" }}
            />
            <label htmlFor="email">Correo electrónico</label>
          </span>

          {/* Contraseña */}
          <span className="p-float-label">
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
              disabled={loading}
              inputStyle={{ background: "#F9FFF2", borderColor: "#aed581" }}
            />
            <label htmlFor="password">Contraseña</label>
          </span>

          {/* Botón */}
          <Button
            type="submit"
            label={loading ? "Conectando..." : "Entrar"}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
            className="w-full"
            disabled={loading}
            style={{ background: "#66bb6a", border: "none", fontWeight: "600" }}
          />
        </form>

        {/* Footer links */}
        <div className="mt-4 text-center" style={{ color: "#6b6b6b" }}>
          ¿Aún no tienes cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#2e7d32", cursor: "pointer", fontWeight: 600 }}
          >
            Regístrate
          </span>
        </div>
      </Card>
    </div>
  );
}
