import Link from "next/link"
import Image from "next/image"
import { SocialButtons } from "./social-buttons"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-6xl mx-auto">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img
                src="/logo-contrast.png"
                alt="Lawn Masters V5"
                className="h-14 w-auto"
              />
            </div>
            <SocialButtons />
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/services" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Lawn Care
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Landscape Design
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Hardscaping
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Tree & Shrub Care
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Pressure Washing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Free Estimate
                </Link>
              </li>
              <li>
                <Link href="/service-policies" className="text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                  Service Policies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-2.5 text-sm text-primary-foreground/70">
              <p>Serving Covington, GA &amp; Surrounding Areas</p>
              <p>
                <a href="tel:+14076000301" className="hover:text-primary transition-colors">
                  (407) 600-0301
                </a>
              </p>
              <p>
                <a href="mailto:lawnmastersv5@gmail.com" className="hover:text-primary transition-colors">
                  lawnmastersv5@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Lawn Masters V5. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
