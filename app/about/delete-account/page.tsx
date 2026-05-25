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
                <h1>Account Deletion Request</h1>

                <p>
                    Last Updated: May 25, 2026
                </p>

                <p>
                    At <strong>Tutotuts</strong>, users have the right to request deletion of their account and associated personal data.
                </p>

                <h2>1. How to Request Account Deletion</h2>

                <p>
                    To request deletion of your account, please contact us using the email address associated with your Tutotuts account.
                </p>

                <p>
                    Send your request to:
                </p>

                <p>
                    <strong>Email:</strong> support@tutotuts.com
                </p>

                <h2>2. Information to Include</h2>

                <p>
                    To help us process your request, please include:
                </p>

                <ul>
                    <li>Your registered email address</li>
                    <li>Your username (if applicable)</li>
                    <li>A clear statement requesting account deletion</li>
                </ul>

                <h2>3. What Happens After Deletion</h2>

                <p>
                    Once your request is verified and processed:
                </p>

                <ul>
                    <li>Your account will be permanently deleted</li>
                    <li>Your profile information will be removed</li>
                    <li>Your saved tutorials, bookmarks, and preferences may be deleted</li>
                    <li>You may lose access to certain platform features permanently</li>
                </ul>

                <h2>4. Data Retention</h2>

                <p>
                    Certain information may be temporarily retained for:
                </p>

                <ul>
                    <li>Legal compliance</li>
                    <li>Fraud prevention</li>
                    <li>Security purposes</li>
                    <li>Backup and recovery systems</li>
                </ul>

                <p>
                    Retained data will only be stored for as long as reasonably necessary.
                </p>

                <h2>5. Processing Time</h2>

                <p>
                    We aim to process verified deletion requests within a reasonable timeframe, typically within 30 days.
                </p>

                <h2>6. Contact</h2>

                <p>
                    If you have questions regarding account deletion or your personal data, please contact:
                </p>

                <p>
                    <strong>Email:</strong> support@tutotuts.com
                </p>
            </div>
        </div>
    );
}