export default function AuthLogo() {
  return (
    <div className="flex items-center gap-1 font-extrabold text-2xl tracking-tighter">
      <span>inktre</span>
      <span className="text-[#25ad50]">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.511 5.833l3.964-4.008 2.52 2.502-3.977 4.004 5.982.022v3.546l-5.982-.022 3.991 4.019-2.52 2.502-3.984-4.015-.008 6.008H10.01l.008-6.008-3.984 4.015-2.52-2.502 3.991-4.019-5.982.022v-3.546l5.982-.022-3.977-4.004 2.52-2.502 3.964 4.008.007-5.833h3.5l-.007 5.833z"/>
        </svg>
      </span>
    </div>
  );
}
