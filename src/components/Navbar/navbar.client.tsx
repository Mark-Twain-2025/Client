"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/auth/Auth";
import { fetchUserCoins } from "@/service/vote";

const menuItems = [
  { label: "Home", icon: "/Nav_home.svg", href: "/" },
  { label: "Result", icon: "/Nav_result.svg", href: "/result" },
  { label: "Ranking", icon: "/Nav_ranking.svg", href: "/ranking" },
  { label: "Quiz", icon: "/Nav_quiz.svg", href: "/quiz" },
  { label: "My Page", icon: "/Nav_mypage.svg", href: "/mypage" },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const pathname = usePathname();

  // const { isLogIn, setIsLogIn, userName } = useAuth();
  const { isLogIn, setIsLogIn, user, setUser } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetchUserCoins(userId).then((c) => {
      console.log('코인 fetch됨:', c);
      setCoins(c);
    });
  }, [pathname]); // 경로가 바뀔 때마다 fetch

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className={`sidebar-hamburger${open ? ' sidebar-hamburger-shift' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open sidebar"
      >
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
      </button>
      {/* Overlay and Sidebar rendered in Portal */}
      {open && typeof window !== "undefined" && createPortal(
        <>
          <div className="sidebar-overlay" onClick={() => setOpen(false)} />
          <aside
            className={`sb-admin-2-sidebar sidebar-slide open`}
            onClick={e => e.stopPropagation()}
          >
            {/* Brand/Logo Section */}
            <div className="sidebar-brand">
              <div className="sidebar-brand-group">
                <Image src="/coin.png" alt="coin" width={30} height={30} />
                <span className="sidebar-brand-text">
                  LunchCoin
                </span>
              </div>
            </div>

            {/* User Profile Section */}
            {isLogIn === true && (
              <div className="sidebar-user-profile">
                <div className="sidebar-user-info">
                  <div className="sidebar-user-avatar">
                    <Image src="/default_bird.png" alt="user" width={50} height={50} />
                  </div>
                  <div className="sidebar-user-details">
                    <div className="sidebar-user-name">{user?.name || "User Name"}</div>
                    {/* <div className="sidebar-user-coin">보유 코인: 100런치</div> */}
                    <div className="sidebar-user-coin">보유 코인: {coins}런치</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <div className="sidebar-menu">
              <ul className="sidebar-nav">
                {menuItems.map((item) => (
                  <li key={item.label} className="sidebar-nav-item">
                    <a
                      className="sidebar-nav-link"
                      onClick={() => { setOpen(false); router.push(item.href); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="sidebar-nav-icon">
                        <Image src={item.icon} alt={item.label} width={16} height={16} />
                      </div>
                      <span className="sidebar-nav-text">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="sidebar-bottom">
              <div className="sidebar-actions">
                {isLogIn === false && (
                  <>
                    <button
                      className="sidebar-action-btn"
                      onClick={() => { setOpen(false); router.push("/signup"); }}
                    >
                      <i className="fas fa-user-plus"></i>
                      <span>Signup</span>
                    </button>
                    <button
                      className="sidebar-action-btn"
                      onClick={() => { setOpen(false); router.push("/login"); }}
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Login</span>
                    </button>
                  </>
                )}
                {isLogIn === true && (
                  <button
                    className="sidebar-action-btn"
                    onClick={() => {
                      // 로그아웃 처리 (쿠키 삭제 등 필요시 추가)
                      setIsLogIn(false);
                      localStorage.removeItem('user');
                      setUser(null);
                      setOpen(false);
                      alert("로그아웃되었습니다");
                      router.push("/");
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </aside>
        </>,
        document.body
      )}
      <style jsx>{`
        .sidebar-hamburger {
          position: fixed;
          top: 1.2rem;
          left: 1.2rem;
          z-index: 2200;
          width: 44px;
          height: 44px;
          background: #fff;
          border: none;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-hamburger-shift {
          left: 15.5rem;
        }
        .hamburger-bar {
          width: 22px;
          height: 3px;
          background: #FFA500;
          border-radius: 2px;
          display: block;
        }
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.18);
          z-index: 2000;
        }
        .sb-admin-2-sidebar {
          z-index: 2100 !important;
          background: #fff !important;
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
          opacity: 1 !important;
          filter: none !important;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          width: 14rem;
          height: 100vh;
          color: #131313;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          border-radius: 0 24px 24px 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-brand {
          padding: 1.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #e3e6f0;
          flex-shrink: 0;
        }

        .sidebar-brand-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: -20px;
        }

        .sidebar-brand-text {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          display: flex;
          align-items: center;
        }

        .sidebar-brand-text-primary {
          color: #131313;
        }

        .sidebar-brand-text-secondary {
          color: #131313;
        }

        .sidebar-user-profile {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #e3e6f0;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .sidebar-user-info {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .sidebar-user-avatar {
          margin-bottom: 0.5rem;
          margin-top: 1rem;
          margin-bottom: 1.2rem;
          display: flex;
          justify-content: center;
        }

        .sidebar-user-avatar img {
          border-radius: 50%;
          border: 3px solid #e3e6f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #131313;
          margin-bottom: 0.25rem;
        }

        .sidebar-user-coin {
          font-size: 0.7rem;
          color: #131313;
          margin-bottom: 1rem;
        }

        .sidebar-menu {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
        }

        .sidebar-nav {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav-item {
          margin: 0;
        }

        .sidebar-nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #131313;
          text-decoration: none;
          transition: all 0.15s ease-in-out;
          border-left: 3px solid transparent;
        }

        .sidebar-nav-link:hover {
          color: #131313;
          background-color: #f8f9fc;
          border-left-color: #FFA500;
        }

        .sidebar-nav-icon {
          width: 1.5rem;
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-nav-text {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .sidebar-bottom {
          padding: 1rem;
          border-top: 1px solid #e3e6f0;
          flex-shrink: 0;
        }

        .sidebar-divider {
          height: 1px;
          background-color: #e3e6f0;
          margin-bottom: 1rem;
        }

        .sidebar-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-action-btn {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: none;
          border: none;
          color: #D94B4B;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          border-radius: 0.35rem;
        }

        .sidebar-action-btn:hover {
          color: #D94B4B;
          background-color: #f8f9fc;
        }

        .sidebar-action-btn i {
          margin-right: 0.5rem;
          width: 1rem;
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sb-admin-2-sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }
        }

        /* Scrollbar styling */
        .sb-admin-2-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sb-admin-2-sidebar::-webkit-scrollbar-track {
          background: #f8f9fc;
        }

        .sb-admin-2-sidebar::-webkit-scrollbar-thumb {
          background: #e3e6f0;
          border-radius: 3px;
        }

        .sb-admin-2-sidebar::-webkit-scrollbar-thumb:hover {
          background: #d1d3e2;
        }
      `}</style>
    </>
  );
}
