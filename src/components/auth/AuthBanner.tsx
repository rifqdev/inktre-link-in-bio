import Image from 'next/image';

export default function AuthBanner() {
  return (
    <div className="hidden md:flex w-1/2 bg-custom-blue relative overflow-hidden items-center justify-center p-12">
      {/* Background Shape */}
      <div className="absolute inset-y-0 right-0 w-2/3 bg-custom-lime z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Mockup Visual */}
        <div className="relative w-full max-w-lg">
          {/* Gambar Utama (Wanita) */}
          <div className="relative z-20 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
              alt="Gaya Hidup"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>

          {/* Floating Elements (Simulasi) */}
          <div className="absolute -top-10 -left-10 w-48 h-32 bg-white/20 backdrop-blur-md rounded-2xl z-30 overflow-hidden border border-white/30 p-2">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=60&w=300"
              alt="Video"
              width={300}
              height={200}
              className="rounded-lg h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-2">
                <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-5 bg-[#f5f5dc] p-6 rounded-2xl shadow-xl z-30 flex flex-col items-center">
            <Image
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"
              alt="Produk"
              width={200}
              height={200}
              className="w-24 h-32 object-contain mb-2"
            />
            <span className="font-bold text-gray-800">$89</span>
          </div>

          {/* Social Icons */}
          <div className="absolute top-10 -right-12 flex flex-col gap-4 z-30">
            <div className="w-12 h-12 bg-[#ff0000] rounded-full flex items-center justify-center shadow-lg text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
            <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-lg text-white">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.306c-.215.353-.675.465-1.028.249-2.85-1.742-6.438-2.135-10.662-1.168-.403.093-.812-.162-.905-.565-.093-.403.162-.812.565-.905 4.625-1.057 8.586-.615 11.78 1.34.353.216.464.675.25 1.029zm1.468-3.26c-.27.439-.846.578-1.285.308-3.262-2.004-8.234-2.585-12.091-1.413-.496.15-1.023-.127-1.173-.623-.15-.496.127-1.023.623-1.173 4.407-1.338 9.89-.684 13.618 1.604.439.27.579.845.308 1.285zm.127-3.41c-3.913-2.324-10.366-2.538-14.137-1.393-.6.181-1.233-.162-1.414-.761-.181-.6.162-1.233.761-1.414 4.314-1.309 11.439-1.053 15.962 1.63.54.32.716 1.014.396 1.554-.319.54-1.013.716-1.554.396z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
