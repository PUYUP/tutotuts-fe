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
                <h1>Privacy Policy</h1>

                <p>
                    Last Updated: May 25, 2026
                </p>

                <p>
                    Welcome to <strong>Tutotuts</strong>.
                    Your privacy is important to us.
                    This Privacy Policy explains how we collect, use, and protect your information when using our platform.
                </p>

                <h2>1. About Tutotuts</h2>

                <p>
                    Tutotuts is a platform that curates tutorial videos from various third-party platforms such as YouTube, TikTok, Instagram, Vimeo, and others.
                    Tutotuts may provide additional AI-generated summaries, step-by-step instructions, categorizations, and educational enhancements for easier learning and discovery.
                </p>

                <h2>2. Information We Collect</h2>

                <p>We may collect the following information:</p>

                <ul>
                    <li>Name or username</li>
                    <li>Email address</li>
                    <li>Profile information</li>
                    <li>Saved tutorials and bookmarks</li>
                    <li>Search history and interactions</li>
                    <li>Device and browser information</li>
                    <li>IP address and approximate location</li>
                    <li>Analytics and usage data</li>
                </ul>

                <h2>3. How We Use Information</h2>

                <p>We use collected information to:</p>

                <ul>
                    <li>Provide and improve our services</li>
                    <li>Personalize tutorial recommendations</li>
                    <li>Improve search and categorization systems</li>
                    <li>Maintain platform security</li>
                    <li>Analyze usage trends</li>
                    <li>Communicate updates or important notices</li>
                </ul>

                <h2>4. Embedded Third-Party Content</h2>

                <p>
                    Tutotuts embeds videos and content hosted by third-party platforms.
                    These platforms may independently collect data through cookies, trackers, or embedded players.
                </p>

                <p>
                    We encourage users to review the privacy policies of those platforms, including:
                </p>

                <ul>
                    <li>YouTube</li>
                    <li>TikTok</li>
                    <li>Instagram</li>
                    <li>Facebook</li>
                    <li>Vimeo</li>
                </ul>

                <h2>5. AI-Generated Content</h2>

                <p>
                    Some summaries, notes, tutorials, and step-by-step guides on Tutotuts may be generated or assisted by artificial intelligence.
                </p>

                <p>
                    While we aim for accuracy, AI-generated content may occasionally contain errors or incomplete information.
                    Users should verify important technical, medical, legal, financial, or safety-related information independently.
                </p>

                <h2>6. Cookies and Analytics</h2>

                <p>
                    We may use cookies and analytics tools to:
                </p>

                <ul>
                    <li>Remember user preferences</li>
                    <li>Improve website performance</li>
                    <li>Measure engagement and traffic</li>
                    <li>Enhance user experience</li>
                </ul>

                <p>
                    Users may disable cookies through their browser settings.
                </p>

                <h2>7. Data Sharing</h2>

                <p>
                    We do not sell personal information to advertisers or third parties.
                </p>

                <p>
                    We may share limited information with trusted service providers for:
                </p>

                <ul>
                    <li>Hosting infrastructure</li>
                    <li>Analytics services</li>
                    <li>Authentication systems</li>
                    <li>Email delivery</li>
                    <li>Security and fraud prevention</li>
                </ul>

                <h2>8. Data Security</h2>

                <p>
                    We implement reasonable security measures to protect user information.
                    However, no method of transmission or storage is completely secure.
                </p>

                <h2>9. User Rights</h2>

                <p>
                    Depending on your region, you may have the right to:
                </p>

                <ul>
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to certain data processing activities</li>
                </ul>

                <h2>10. Children's Privacy</h2>

                <p>
                    Tutotuts is not intended for children under 13 years old.
                    We do not knowingly collect personal information from children.
                </p>

                <h2>11. Changes to This Policy</h2>

                <p>
                    We may update this Privacy Policy from time to time.
                    Continued use of the platform after changes means you accept the updated policy.
                </p>

                <h2>12. Contact</h2>

                <p>
                    If you have questions regarding this Privacy Policy, you may contact us at:
                </p>

                <p>
                    <strong>Email:</strong> support@tutotuts.com
                </p>
            </div>
        </div>
    );
}