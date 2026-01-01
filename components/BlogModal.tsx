
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../types';
import { X, Calendar, User, Clock, Tag, Share2, Facebook, Twitter, Link } from 'lucide-react';

interface BlogModalProps {
    post: BlogPost | null;
    isOpen: boolean;
    onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, isOpen, onClose }) => {
    if (!post) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden p-0 md:p-6 lg:p-12">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full h-full max-w-5xl bg-white dark:bg-[#0a0a0a] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 z-[120] p-3 rounded-full bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>

                        {/* Scrollable Content */}
                        <div className="flex-grow overflow-y-auto no-scrollbar">
                            {/* Header Hero */}
                            <div className="relative h-[60vh] md:h-[70vh] w-full">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-20">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="max-w-4xl"
                                    >
                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                            <div className="px-5 py-2 rounded-full bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
                                                {post.category}
                                            </div>
                                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>{new Date(post.publishedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    <span>{post.readTime} de lectura</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] mb-8">
                                            {post.title}
                                        </h1>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center font-black text-sm">
                                                {post.author.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Escrito por</p>
                                                <p className="text-sm font-black text-neutral-900 dark:text-white uppercase italic">{post.author}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Main Text Content */}
                            <div className="px-8 md:px-16 lg:px-20 pb-24">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    {/* Content Column */}

                                    <div className="lg:col-span-8">
                                        <div className="space-y-8 text-neutral-600 dark:text-neutral-400">
                                            {/* Simple manual "prose" styling implementation */}
                                            <style dangerouslySetInnerHTML={{
                                                __html: `
                        .blog-content h2 { 
                          font-size: 1.875rem; 
                          font-weight: 900; 
                          text-transform: uppercase; 
                          font-style: italic; 
                          letter-spacing: -0.05em; 
                          color: var(--tw-prose-headings, #111);
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                        }
                        .dark .blog-content h2 { color: #fff; }
                        .blog-content p { 
                          font-size: 1.125rem; 
                          line-height: 1.75; 
                          margin-bottom: 1.5rem;
                          font-weight: 500;
                        }
                        .blog-content ul { 
                          list-style-type: disc; 
                          padding-left: 1.5rem; 
                          margin-bottom: 1.5rem;
                        }
                        .blog-content li { 
                          margin-bottom: 0.5rem;
                          font-size: 1.125rem;
                        }
                        .blog-content strong { color: #db2715; font-weight: 900; }
                        .blog-content blockquote {
                          border-left: 4px solid #db2715;
                          padding-left: 1.5rem;
                          font-style: italic;
                          font-weight: 900;
                          font-size: 1.5rem;
                          margin: 2.5rem 0;
                          color: #111;
                        }
                        .dark .blog-content blockquote { color: #fff; }
                      `}} />
                                            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                                        </div>
                                    </div>
                                    {/* Sidebar Info */}
                                    <div className="lg:col-span-4">
                                        <div className="sticky top-12 space-y-12">
                                            {/* Summary Box */}
                                            <div className="p-8 rounded-[2rem] bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
                                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary-600 mb-4 italic">Resumen Ejecutivo</h4>
                                                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300 leading-relaxed uppercase tracking-wide">
                                                    {post.excerpt}
                                                </p>
                                            </div>

                                            {/* Share Section */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 italic">Compartir Estratégia</h4>
                                                <div className="flex gap-4">
                                                    {[Facebook, Twitter, Share2, Link].map((Icon, i) => (
                                                        <button key={i} className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center">
                                                            <Icon size={18} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BlogModal;
