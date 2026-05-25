"use client";

import { useState, useEffect } from "react";

export default function PrivacyPolicy() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
            <div className="block pt-0 px-4 sm:px-8 md:px-8 lg:px-14 max-w-8xl mx-auto prose-content">
                <h1>Terms of Service</h1>

                <p>
                    Last Updated: May 25, 2026
                </p>

                <p>
                    Welcome to <strong>Tutotuts</strong>.
                    By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.
                </p>

                <h2>1. About Tutotuts</h2>

                <p>
                    Tutotuts is a platform that curates and organizes tutorial videos from third-party platforms such as YouTube, TikTok, Instagram, Vimeo, and others.
                </p>

                <p>
                    Tutotuts may provide AI-generated summaries, notes, categorizations, timestamps, and step-by-step educational content to improve learning accessibility and discovery.
                </p>

                <h2>2. Acceptance of Terms</h2>

                <p>
                    By using Tutotuts, you agree to these Terms of Service and our Privacy Policy.
                    If you do not agree, you should discontinue use of the platform.
                </p>

                <h2>3. User Accounts</h2>

                <p>
                    Some features may require account registration.
                    Users are responsible for:
                </p>

                <ul>
                    <li>Maintaining account security</li>
                    <li>Providing accurate information</li>
                    <li>All activities performed under their account</li>
                </ul>

                <p>
                    We reserve the right to suspend or terminate accounts that violate these terms.
                </p>

                <h2>4. Embedded Third-Party Content</h2>

                <p>
                    Tutotuts does not claim ownership of embedded third-party videos or media.
                </p>

                <p>
                    All copyrights and ownership remain with the original creators and platforms.
                </p>

                <p>
                    Embedded content is displayed using publicly available embedding features or APIs provided by the respective platforms.
                </p>

                <h2>5. AI-Generated Content Disclaimer</h2>

                <p>
                    Some tutorials, summaries, explanations, timestamps, and step-by-step instructions may be generated or assisted by artificial intelligence.
                </p>

                <p>
                    While we aim for accuracy, AI-generated content may contain mistakes, outdated information, or incomplete guidance.
                </p>

                <p>
                    Users should independently verify important technical, financial, legal, medical, or safety-related information before relying on it.
                </p>

                <h2>6. Acceptable Use</h2>

                <p>
                    Users agree not to:
                </p>

                <ul>
                    <li>Use the platform for illegal purposes</li>
                    <li>Attempt to disrupt or damage the platform</li>
                    <li>Scrape or abuse the service excessively</li>
                    <li>Upload malicious software or harmful code</li>
                    <li>Violate intellectual property rights</li>
                    <li>Harass, abuse, or impersonate others</li>
                </ul>

                <h2>7. Intellectual Property</h2>

                <p>
                    Tutotuts branding, interface design, AI-generated enhancements, categorizations, and platform-specific features are protected by intellectual property laws.
                </p>

                <p>
                    Users may not copy, reproduce, or redistribute platform content without permission unless otherwise permitted by law.
                </p>

                <h2>8. External Links and Services</h2>

                <p>
                    Tutotuts may contain links or embedded content from third-party services.
                    We are not responsible for:
                </p>

                <ul>
                    <li>Third-party content accuracy</li>
                    <li>Availability of external services</li>
                    <li>Third-party privacy practices</li>
                    <li>Policies or actions of external platforms</li>
                </ul>

                <h2>9. Service Availability</h2>

                <p>
                    We may modify, suspend, or discontinue parts of the platform at any time without prior notice.
                </p>

                <p>
                    We do not guarantee uninterrupted or error-free availability.
                </p>

                <h2>10. Limitation of Liability</h2>

                <p>
                    To the maximum extent permitted by law, Tutotuts shall not be liable for:
                </p>

                <ul>
                    <li>Indirect or consequential damages</li>
                    <li>Loss of data or profits</li>
                    <li>Errors in tutorials or AI-generated content</li>
                    <li>Issues caused by third-party platforms</li>
                    <li>User reliance on educational content</li>
                </ul>

                <h2>11. Termination</h2>

                <p>
                    We reserve the right to suspend or terminate access to the platform for users who violate these Terms of Service or misuse the platform.
                </p>

                <h2>12. Changes to Terms</h2>

                <p>
                    We may update these Terms of Service from time to time.
                    Continued use of the platform after updates constitutes acceptance of the revised terms.
                </p>

                <h2>13. Contact</h2>

                <p>
                    For questions regarding these Terms of Service, please contact:
                </p>

                <p>
                    <strong>Email:</strong> support@tutotuts.com
                </p>
            </div>
        </div>
    );
}