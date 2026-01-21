import { APP_NAME } from "@/config";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Contact"],
    },
    {
      title: "Support",
      links: ["Help Center", "FAQs", "Terms of Use", "Privacy Policy"],
    },
    {
      title: "Browse",
      links: ["Movies", "TV Shows", "Originals", "New Releases"],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-stream-darker border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Social */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold text-gradient">{APP_NAME}</span>
            <p className="mt-3 text-sm text-muted-foreground">
              Stream unlimited movies and TV shows on your favorite devices.
            </p>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
