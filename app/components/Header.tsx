import Image from "next/image";
import Link from "next/link";

interface MenuNode {
    name: string;
    url: string;
}

const menus: MenuNode[] = [
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/about/privacy-policy" },
    { name: "Term of Use", url: "/about/term-of-use" },
];

export default function Header() {
    return (
        <header className="py-8 lg:py-10 px-4 sm:px-8 md:px-8 lg:px-14">
            <div className="max-w-8xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center">
                    <Link href={"/"} style={{ marginLeft: -8 }}>
                        <Image
                            src="/tutotuts-logo.png"
                            alt="Tutotuts Logo"
                            width={220}
                            height={100}
                            priority
                            className="w-auto h-10 lg:h-14"
                        />
                    </Link>
                </div>

                {/* Menu */}
                <nav className="md:flex items-center gap-8 text-sm lg:text-base font-medium flex gap-4">
                    {menus.map((menu) => (
                        <Link
                            key={menu.url}
                            href={menu.url}
                            className="hover:text-red-500 transition-colors"
                        >
                            {menu.name}
                        </Link>
                    ))}
                </nav>

            </div>
        </header>
    );
}