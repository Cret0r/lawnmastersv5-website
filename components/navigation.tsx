"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import styles from "./admin-nav-button.module.css"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <img
              src={isScrolled ? "/logo-color.png" : "/logo-contrast.png"}
              alt="Lawn Masters V5"
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className={`transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              Services
            </Link>
            <Link
              href="/gallery"
              className={`transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin" className={`hidden md:flex ${styles.userProfile}`}>
              <div className={styles.userProfileInner}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                Admin
              </div>
            </Link>
            <Button asChild className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/quote">Free Estimate</Link>
            </Button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-foreground hover:bg-muted" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm md:hidden" onClick={closeMobileMenu} />
      )}

      <div
        className={`fixed top-20 right-0 bottom-0 w-72 bg-card shadow-xl transform transition-transform duration-300 ease-in-out md:hidden border-l border-border ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-6">
          <Link
            href="/services"
            className="text-foreground hover:text-primary transition-colors text-lg"
            onClick={closeMobileMenu}
          >
            Services
          </Link>
          <Link
            href="/gallery"
            className="text-foreground hover:text-primary transition-colors text-lg"
            onClick={closeMobileMenu}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors text-lg"
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary transition-colors text-lg"
            onClick={closeMobileMenu}
          >
            Contact
          </Link>

          <div className="border-t border-border pt-6 flex flex-col gap-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/quote" onClick={closeMobileMenu}>
                Free Estimate
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
