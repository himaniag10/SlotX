import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <span className="font-bold text-2xl text-indigo-600 tracking-tight block mb-4">
                            Slot<span className="text-yellow-500">X</span>
                        </span>
                        <p className="text-gray-500 max-w-xs leading-relaxed">
                            Democratizing exam slot booking with transparency and speed.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-500">
                            <li><a href="/#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                            <li><a href="/#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                            <li><a href="/#" className="hover:text-indigo-600 transition-colors">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-500">
                            <li><a href="/#" className="hover:text-indigo-600 transition-colors">About</a></li>
                            <li><a href="/#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                            <li><a href="/#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">© 2026 SlotX Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-gray-400">
                        <a href="/#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                        <a href="/#" className="hover:text-indigo-600 transition-colors">GitHub</a>
                        <a href="/#" className="hover:text-indigo-600 transition-colors">Discord</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;