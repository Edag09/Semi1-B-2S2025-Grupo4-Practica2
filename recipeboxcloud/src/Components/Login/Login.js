// src/pages/Login.jsx
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");     // usuario o email
  const [contrasena, setContrasena] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !contrasena) {
      toast.current.show({
        severity: "warn",
        summary: "Campos requeridos",
        detail: "Ingresa tu usuario/email y contraseña",
      });
      return;
    }

    try {
      console.log({ userOrEmail: usuario, password: contrasena });
      toast.current.show({
        severity: "success",
        summary: "¡Bienvenido!",
        detail: "Login exitoso",
      });
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err?.response?.data?.error || "Credenciales inválidas",
      });
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen p-3"
      style={{
        // Fondo alegre tipo recetario: degradé “limón & aguacate”
        background:
          "linear-gradient(135deg, #fff8e1 0%, #e8f5e9 40%, #dcedc8 100%)",
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
          {/* Usuario o correo */}
          <span className="p-float-label">
            <InputText
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full"
              style={{
                background: "#F9FFF2",
                borderColor: "#aed581",
              }}
            />
            <label htmlFor="usuario">Usuario o correo</label>
          </span>

          {/* Contraseña */}
          <span className="p-float-label">
            <Password
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
              inputStyle={{
                background: "#F9FFF2",
                borderColor: "#aed581",
              }}
            />
            <label htmlFor="contrasena">Contraseña</label>
          </span>

          {/* Botón */}
          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            className="w-full"
            onClick={() => navigate("/home")}
            style={{
              background: "#66bb6a",
              border: "none",
              fontWeight: "600",
            }}
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
        <div className="mt-2 text-center" style={{ color: "#6b6b6b" }}>
          ¿Olvidaste tu contraseña?{" "}
          <span
            onClick={() => navigate("/recuperar-password")}
            style={{ color: "#2e7d32", cursor: "pointer", fontWeight: 600 }}
          >
            Recupérala
          </span>
        </div>
      </Card>
    </div>
  );
}
