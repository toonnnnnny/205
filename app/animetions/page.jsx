"use client";
import { useEffect, useState } from "react";
import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";
const pictures = {
  none: null,
  basketball: "basketball.jpg",
  football: "football.png",
  volleyball: "volleyball.png",
  std: "student.jpg",
};
// Adapted from W04: 640 × 480 field, 50px radius, 100px/s velocity, 25fps.
export default function Animation() {
  const router = useRouter();
  useEffect(() => checkLogin(router, "/animetions"), [router]);
  
  const [ballType, setBallType] = useState("none");
  const [running, setRunning] = useState(false);
  const [motion, setMotion] = useState({ x: 0, y: 0, dx: 1, dy: 1, angle: 0 });
  useEffect(() => {
    const handle = (e) => {
      if (
        e.target instanceof HTMLElement &&
        /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((v) => !v);
      }
      const types = ["none", "basketball", "football", "volleyball", "std"];
      if (e.key >= "1" && e.key <= "5") setBallType(types[Number(e.key) - 1]);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () =>
        setMotion((m) => {
          const step = Math.round(100 * Math.sqrt(2)) / 25;
          let { x, y, dx, dy, angle } = m;
          x += step * dx;
          y += step * dy;
          if (x >= 535) {
            x = 1070 - x;
            dx = -1;
          } else if (x <= 0) {
            x = -x;
            dx = 1;
          }
          if (y >= 375) {
            y = 750 - y;
            dy = -1;
          } else if (y <= 0) {
            y = -y;
            dy = 1;
          }
          return { x, y, dx, dy, angle: angle + dy * 0.05 };
        }),
      40,
    );
    return () => clearInterval(timer);
  }, [running]);
  return (
    <section className="animation-work">
      <div className="animation-scroll">
        <div
          className="animation-field"
          style={{
            backgroundImage: "url(/animetions/assets/img/wallpaper.jpg)",
          }}
        >
          <div
            className="animation-ball"
            style={{
              left: motion.x,
              top: motion.y,
              transform: `rotate(${motion.angle}rad)`,
              backgroundImage: pictures[ballType]
                ? `url(/animetions/assets/img/${pictures[ballType]})`
                : "none",
            }}
          />
        </div>
      </div>
      <div className="animation-controls">
        <button
          className={running ? "pause" : "play"}
          onClick={() => setRunning((v) => !v)}
        >
          {running ? "⏸ Pause" : "▶ Play"}
        </button>
        <div className="ball-options">
          {[
            ["none", "None"],
            ["basketball", "Basketball"],
            ["football", "Football"],
            ["volleyball", "Volleyball"],
            ["std", "Student"],
          ].map(([type, label]) => (
            <button
              key={type}
              aria-pressed={type === ballType}
              onClick={() => setBallType(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Space: Play / Pause · 1–5: เลือกรูป
      </p>
    </section>
  );
}
