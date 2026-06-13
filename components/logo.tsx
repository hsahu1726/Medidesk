import Image from "next/image";

export default function MediDeskLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/whatsapp-20image-202025-11-17-20at-2018.jpg"
        alt="MediDesk Logo"
        width={48}
        height={48}
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
