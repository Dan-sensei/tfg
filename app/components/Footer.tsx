import { IconTopologyRing2 } from "@tabler/icons-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className=" bg-dark py-8 px-8 xl:px-40 border-t-1 border-t-white/5">
            <div className="container mx-auto grid grid-cols-1 xl:gap-20 2xl:gap-52 xl:grid-cols-5">
                <div className="col-span-3">
                    <IconTopologyRing2 className="stroke-[#258fe6]" size={50} />
                    <div className="text-tg-gray/50 pt-5">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, quod.
                    </div>
                    <div className="text-tg-gray/50 pt-5">© 2024 All rights reserved.</div>
                </div>
                <div className="col-span-2 flex pt-16 xl:pt-0 gap-20 2xl:gap-24">
                    <div className="flex flex-col gap-3 text-tg-gray">
                        <span className="text-white">ABOUT US</span>
                        <Link className="hover:text-tg-bubblegum transition-colors" href="/privacy-policy">
                            Privacy Policy
                        </Link>
                        <Link className="hover:text-tg-bubblegum transition-colors" href="/terms-of-service">
                            Terms of service
                        </Link>
                        <Link className="hover:text-tg-bubblegum transition-colors" href="/">
                            Home
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3 text-tg-gray ">
                        <span className="text-white">MEDIA</span>
                        <Link className="hover:text-tg-bubblegum transition-colors" target="_blank" href="https://youtube.com">
                            Youtube
                        </Link>
                        <Link className="hover:text-tg-bubblegum transition-colors" target="_blank" href="https://x.com">
                            Twitter
                        </Link>
                        <Link className="hover:text-tg-bubblegum transition-colors" target="_blank" href="https://twitch.com">
                            Twitch
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
