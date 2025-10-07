// src/pages/Register.jsx (BETA: solo simulación)
import React, { useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");

  // Solo preview local de imagen (no se sube)
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFilePreview(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!username.trim() || !email.trim() || !password || !confirm) {
      toast.current.show({ severity: "warn", summary: "Campos", detail: "Completa todos los campos" });
      return false;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast.current.show({ severity: "warn", summary: "Email", detail: "Ingresa un correo válido" });
      return false;
    }
    if (password.length < 6) {
      toast.current.show({ severity: "info", summary: "Contraseña", detail: "Usa al menos 6 caracteres" });
      return false;
    }
    if (password !== confirm) {
      toast.current.show({ severity: "error", summary: "Contraseñas", detail: "No coinciden" });
      return false;
    }
    if (!filePreview) {
      toast.current.show({ severity: "info", summary: "Foto", detail: "Sube tu foto de perfil" });
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulación: “procesando…”
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.current.show({ severity: "success", summary: "Registro", detail: "Usuario simulado creado" });
      // Redirige al login
      setTimeout(() => navigate("/login"), 800);
    }, 900);
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen p-3"
      style={{ background: "linear-gradient(135deg, #fffde7 0%, #e8f5e9 50%, #f1f8e9 100%)" }}
    >
      <Toast ref={toast} />
      <Card
        title={
          <div className="text-center">
            <h2 style={{ color: "#2e7d32", margin: 0 }}>Crear cuenta</h2>
            <small style={{ color: "#7cb342" }}>Versión beta (sin guardar) 🍋🥑</small>
          </div>
        }
        className="shadow-4"
        style={{
          width: "520px",
          background: "rgba(255,255,255,0.96)",
          border: "2px solid #c5e1a5",
          borderRadius: 16,
        }}
      >
        <form onSubmit={handleRegister} className="flex flex-column gap-3">
          {/* Username */}
          <span className="p-float-label">
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              disabled={loading}
              style={{ background: "#F9FFF2", borderColor: "#aed581" }}
            />
            <label htmlFor="username">Nombre de usuario</label>
          </span>

          {/* Email */}
          <span className="p-float-label">
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={loading}
              style={{ background: "#F9FFF2", borderColor: "#aed581" }}
            />
            <label htmlFor="email">Correo electrónico</label>
          </span>

          {/* Password */}
          <span className="p-float-label">
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              inputClassName="w-full"
              disabled={loading}
              inputStyle={{ background: "#F9FFF2", borderColor: "#aed581" }}
            />
            <label htmlFor="password">Contraseña</label>
          </span>

          {/* Confirm */}
          <span className="p-float-label">
            <Password
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              feedback={false}
              toggleMask
              inputClassName="w-full"
              disabled={loading}
              inputStyle={{ background: "#F9FFF2", borderColor: "#aed581" }}
            />
            <label htmlFor="confirm">Confirmar contraseña</label>
          </span>

          {/* Foto (solo preview, sin upload) */}
          <div className="flex flex-column gap-2">
            <small className="text-600">Foto de perfil (JPG/PNG) — solo vista previa</small>
            <input type="file" accept="image/*" onChange={onPickFile} disabled={loading} />
            {filePreview && (
              <img
                src={filePreview}
                alt="preview"
                style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 12, border: "1px solid #c5e1a5" }}
              />
            )}
          </div>

          <Button
            type="submit"
            label={loading ? "Procesando..." : "Registrarse"}
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
            className="w-full"
            disabled={loading}
            style={{ background: "#66bb6a", border: "none", fontWeight: 600 }}
          />

          <Button
            type="button"
            label="Ya tengo cuenta"
            className="p-button-text w-full"
            onClick={() => navigate("/")}
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
