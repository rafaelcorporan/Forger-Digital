"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations"

export function Footer() {
  const { t } = useTranslation('footer')
  return (
    <footer
      id="footer"
      className="text-white relative"
      style={{ backgroundColor: '#000000' }}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Thin gradient line at top edge - pink to purple */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-pink-500 to-purple-600"></div>
      <div className="container mx-auto px-4 pt-16 pb-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand Section */}
          <motion.div variants={staggerItem} className="lg:col-span-1">
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="Forger Digital"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="mb-6 text-sm text-gray-400 leading-relaxed">
              <p>{t('common.tagline.line1')}</p>
              <p>{t('common.tagline.line2')}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>hello@forgerdigital.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>+1 (347) 829-4952</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links - White symbols on dark background, bordered in white, gradient on hover */}
            <div className="flex gap-3">
              <Link
                href="#"
                className="group w-10 h-10 bg-gray-900 border border-white rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:via-orange-600 hover:to-pink-500 active:bg-gradient-to-r active:from-orange-500 active:via-orange-600 active:to-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label={(Array.isArray(t('social.twitter')) ? t('social.twitter')[0] : t('social.twitter')) as string}
              >
                <span className="sr-only">{(Array.isArray(t('social.twitter')) ? t('social.twitter')[0] : t('social.twitter')) as string}</span>
                <svg className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="group w-10 h-10 bg-gray-900 border border-white rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:via-orange-600 hover:to-pink-500 active:bg-gradient-to-r active:from-orange-500 active:via-orange-600 active:to-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label={(Array.isArray(t('social.github')) ? t('social.github')[0] : t('social.github')) as string}
              >
                <span className="sr-only">{(Array.isArray(t('social.github')) ? t('social.github')[0] : t('social.github')) as string}</span>
                <svg className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                className="group w-10 h-10 bg-gray-900 border border-white rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:via-orange-600 hover:to-pink-500 active:bg-gradient-to-r active:from-orange-500 active:via-orange-600 active:to-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label={(Array.isArray(t('social.linkedin')) ? t('social.linkedin')[0] : t('social.linkedin')) as string}
              >
                <span className="sr-only">{(Array.isArray(t('social.linkedin')) ? t('social.linkedin')[0] : t('social.linkedin')) as string}</span>
                <svg className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Link Columns */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-4 text-base font-bold text-white">{t('company')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.about')}
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.services')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.careers')}
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.team')}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.contact')}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h3 className="mb-4 text-base font-bold text-white">{t('resources')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/get-started" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.gettingStarted')}
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.caseStudies')}
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.apiDocumentation')}
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.support')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.insights')}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h3 className="mb-4 text-base font-bold text-white">{t('legal')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/privacy-policy" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms-of-service" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.termsOfService')}
                </Link>
              </li>
              <li>
                <Link href="/legal/security" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.security')}
                </Link>
              </li>
              <li>
                <Link href="/legal/content-security-policy" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.contentSecurityPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/legal/compliance" className="text-sm text-white hover:text-orange-500 transition-colors scroll-smooth">
                  {t('links.compliance')}
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          className="mt-8 pt-6 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              {t('copyright')}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/legal/privacy-policy" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded">
                {t('links.privacyPolicy')}
              </Link>
              <Link href="/legal/terms-of-service" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded">
                {t('links.termsOfService')}
              </Link>
              <Link href="/legal/cookie-policy" className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded">
                {t('links.cookiePolicy')}
              </Link>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("openCookieConsent"))
                  }
                }}
                className="hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded text-left"
              >
                {t('links.manageCookies')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
