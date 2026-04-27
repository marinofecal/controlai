import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          className="text-6xl font-bold text-white mb-4 tracking-tight"
          animate={{
            backgroundPosition: ['0%', '100%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            backgroundImage: 'linear-gradient(90deg, #60a5fa, #3b82f6, #60a5fa)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ControlAI
        </motion.h1>
        <p className="text-xl text-slate-400 mb-8">
          Enterprise Compliance Analysis Powered by AI
        </p>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full" />
        </motion.div>

        <p className="text-slate-500 mt-8">Redirecting to dashboard...</p>
      </motion.div>
    </div>
  );
}
