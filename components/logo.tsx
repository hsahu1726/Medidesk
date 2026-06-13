export default function MediDeskLogo() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-17%20at%2018.39.16_c5907857-CCFQfiudNqNMwOWOgqNtHa8YFw38IK.jpg"
        alt="MediDesk Logo"
        className="w-12 h-12 object-contain rounded-lg"
      />

      {/* Text */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">MediDesk</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">Smart Medicine Helper</p>
      </div>
    </div>
  );
}
