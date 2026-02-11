import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 pt-20 pb-12">
            <div className="w-full px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                                <span className="font-black text-white text-xs">S</span>
                            </div>
                            <span className="font-black text-2xl text-slate-900 tracking-tighter">
                                Slot<span className="text-violet-600">X</span>
                            </span>
                        </div>
                        <p className="text-gray-500 max-w-xs leading-relaxed font-medium">
                            Democratizing exam slot coordination with high-precision infrastructure and absolute transparency.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Environment</h4>
                        <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <li><a href="/#" className="hover:text-violet-600 transition-colors">Manifest</a></li>
                            <li><a href="/#" className="hover:text-violet-600 transition-colors">Nodes</a></li>
                            <li><a href="/#" className="hover:text-violet-600 transition-colors">Logs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Command</h4>
                        <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <li><a href="/#" className="hover:text-violet-600 transition-colors">Safety</a></li>
                            <li><a href="/#" className="hover:text-violet-600 transition-colors">Support</a></li>
                            <li><a href="/#" className="hover:text-violet-600 transition-colors">Terminal</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">© 2026 SlotX Coordination Unit. [All rights reserved]</p>
                    <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <a href="/#" className="hover:text-violet-600 transition-colors">Twitter</a>
                        <a href="/#" className="hover:text-violet-600 transition-colors">Network</a>
                        <a href="/#" className="hover:text-violet-600 transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;