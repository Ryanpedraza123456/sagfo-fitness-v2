
import React from 'react';

interface FooterProps {
  sealUrl?: string;
}

const Footer: React.FC<FooterProps> = ({ sealUrl }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-white mb-6 tracking-tighter italic">
              SAGFO<span className="text-primary-500">FITNESS</span>
            </h2>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Dedicados a equipar a campeones. Maquinaria de gimnasio de alta gama, diseñada para biomecánica perfecta y durabilidad extrema.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholders */}
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors cursor-pointer"><span className="font-bold">IG</span></div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors cursor-pointer"><span className="font-bold">FB</span></div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors cursor-pointer"><span className="font-bold">TT</span></div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white tracking-widest uppercase text-xs mb-6">Contacto Directo</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Calle 4 #3-17<br />Barrio La Victoria</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>310 393 6762</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>johngarcia_saga@hotmail.com</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <h4 className="font-bold text-white tracking-widest uppercase text-xs mb-2">Asesor Ventas</h4>
              <p className="text-sm text-neutral-300 flex items-center">
                <svg className="w-4 h-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                310 245 9620
              </p>
            </div>
          </div>

          {/* Quality Seal */}
          <div className="flex flex-col items-center justify-start pt-4 lg:pt-0">
            {sealUrl ? (
              <div className="relative group cursor-default">
                <img src={sealUrl} alt="Sello de Calidad" className="w-32 h-32 object-contain drop-shadow-lg transform transition-transform group-hover:scale-105" />
              </div>
            ) : (
              <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-neutral-700 rounded-full text-neutral-600 text-xs text-center p-2 opacity-30">
              </div>
            )}
            <p className="text-center text-xs text-neutral-500 mt-4 max-w-[150px]">Comprometidos con la excelencia en cada soldadura.</p>
          </div>

          {/* Legal / Entities */}
          <div>
            <h3 className="font-bold text-white tracking-widest uppercase text-xs mb-6">Empresa Verificada</h3>
            <p className="text-xs text-neutral-500 mb-4">Vigilado y controlado por:</p>
            <div className="grid grid-cols-2 gap-3">
              <a href="https://www.rues.org.co/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-all border border-neutral-800 hover:border-neutral-600 h-12">
                <span className="text-xs font-bold text-white">RUES</span>
              </a>
              <a href="https://www.mintrabajo.gov.co/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-all border border-neutral-800 hover:border-neutral-600 h-12">
                <span className="text-xs font-bold text-white">MinTrabajo</span>
              </a>
              <a href="https://www.sic.gov.co/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-all border border-neutral-800 hover:border-neutral-600 h-12">
                <span className="text-xs font-bold text-white">SIC</span>
              </a>
              <a href="https://www.dian.gov.co/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg flex items-center justify-center transition-all border border-neutral-800 hover:border-neutral-600 h-12">
                <span className="text-xs font-bold text-white">DIAN</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
          <p>&copy; {new Date().getFullYear()} SAGFO FITNESS. Todos los derechos reservados.</p>
          <div className="flex flex-col md:items-end mt-4 md:mt-0 gap-2">
            <div className="flex space-x-4">
              <span className="hover:text-white cursor-pointer">Términos y Condiciones</span>
              <span className="hover:text-white cursor-pointer">Política de Privacidad</span>
            </div>
            <p className="text-[10px] text-neutral-700">
              Desarrollado por <span className="text-neutral-500 font-bold hover:text-primary-500 transition-colors">ING.BRAYAN PEDRAZA</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
